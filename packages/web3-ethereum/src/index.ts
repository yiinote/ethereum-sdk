import type { Contract, ContractSendMethod } from "web3-eth-contract"
import type Web3 from "web3"
import type { PromiEvent, TransactionReceipt } from "web3-core"
import { signTypedData } from "@rarible/ethereum-provider"
import type { MessageTypes, TypedMessage } from "@rarible/ethereum-provider"
import type { Address, BigNumber, Binary, Word } from "@rarible/types"
import { toAddress, toBigNumber, toBinary, toWord } from "@rarible/types"
import { backOff } from "exponential-backoff"
import type * as EthereumProvider from "@rarible/ethereum-provider"
import type { AbiItem } from "web3-utils"
import type { Web3EthereumConfig } from "./domain"
import { providerRequest } from "./utils/provider-request"
import { toPromises } from "./utils/to-promises"
import {
	getContractMethodReceiptEvents,
	getTransactionReceiptEvents,
} from "./utils/log-parser"

export class Web3Ethereum implements EthereumProvider.Ethereum {
	constructor(private readonly config: Web3EthereumConfig) {
		this.send = this.send.bind(this)
	}

	createContract(abi: any, address?: string): EthereumProvider.EthereumContract {
		return new Web3Contract(this.config, new this.config.web3.eth.Contract(abi, address))
	}

	async send(method: string, params: unknown[]): Promise<any> {
		return providerRequest(this.config.web3.currentProvider, method, params)
	}

	async personalSign(message: string): Promise<string> {
		const signer = await this.getFrom()
		return (this.config.web3.eth.personal as any).sign(message, signer)
	}

	async signTypedData<T extends MessageTypes>(data: TypedMessage<T>): Promise<string> {
		const signer = await this.getFrom()
		return signTypedData(this.send, signer, data)
	}

	async getFrom(): Promise<string> {
		return getFrom(this.config.web3, this.config.from)
	}

	encodeParameter(type: any, parameter: any): string {
		return this.config.web3.eth.abi.encodeParameter(type, parameter)
	}

	decodeParameter(type: any, data: string): any {
		return this.config.web3.eth.abi.decodeParameters([type], data)
	}

	async getBalance(address: Address): Promise<BigNumber> {
		return toBigNumber(await this.config.web3.eth.getBalance(address))
	}

	async getChainId(): Promise<number> {
		return this.config.web3.eth.getChainId()
	}

	getWeb3Instance(): Web3 {
		return this.config.web3
	}
}

export class Web3Contract implements EthereumProvider.EthereumContract {
	constructor(private readonly config: Web3EthereumConfig, private readonly contract: Contract) {
	}

	functionCall(name: string, ...args: any): EthereumProvider.EthereumFunctionCall {
		return new Web3FunctionCall(
			this.config, this.contract, name, args,
		)
	}
}

export class Web3FunctionCall implements EthereumProvider.EthereumFunctionCall {
	private readonly sendMethod: ContractSendMethod

	constructor(
		private readonly config: Web3EthereumConfig,
		private readonly contract: Contract,
		private readonly methodName: string,
		private readonly args: any[],
	) {
		this.sendMethod = this.contract.methods[this.methodName](...this.args)
	}

	async getCallInfo(): Promise<EthereumProvider.EthereumFunctionCallInfo> {
		return {
			method: this.methodName,
			contract: this.contract.options.address,
			args: this.args,
			from: await this.getFrom(),
			provider: "web3",
		}
	}

	async getData(): Promise<string> {
		return this.sendMethod.encodeABI()
	}

	estimateGas(options: EthereumProvider.EthereumEstimateGasOptions = {}) {
		return this.sendMethod.estimateGas(options)
	}

	call(options: EthereumProvider.EthereumSendOptions = {}): Promise<any> {
		return this.sendMethod.call({
			from: this.config.from,
			gas: options.gas,
			gasPrice: options.gasPrice?.toString(),
		})
	}

	async send(options: EthereumProvider.EthereumSendOptions = {}): Promise<EthereumProvider.EthereumTransaction> {
		const from = toAddress(await this.getFrom())
		if (options.additionalData) {
			const additionalData = toBinary(options.additionalData).slice(2)
			const sourceData = toBinary(await this.getData()).slice(2)

			const data = `0x${sourceData}${additionalData}`
			const promiEvent = this.config.web3.eth.sendTransaction({
				from,
				to: this.contract.options.address,
				data,
				gas: this.config.gas || options.gas,
				value: options.value,
				gasPrice: options.gasPrice?.toString(),
			})
			const { hash, receipt } = toPromises(promiEvent)
			const hashValue = await hash
			const tx = await this.getTransaction(hashValue)

			return new Web3Transaction(
				receipt,
				toWord(hashValue),
				toBinary(data),
				tx.nonce,
				from,
				toAddress(this.contract.options.address),
				this.contract.options.jsonInterface
			)
		}

		const promiEvent: PromiEvent<Contract> = this.sendMethod.send({
			from,
			gas: this.config.gas || options.gas,
			value: options.value,
			gasPrice: options.gasPrice?.toString(),
		})
		const { hash, receipt } = toPromises(promiEvent)
		const hashValue = await hash
		const tx = await this.getTransaction(hashValue)
		return new Web3Transaction(
			receipt,
			toWord(hashValue),
			toBinary(await this.getData()),
			tx.nonce,
			from,
			toAddress(this.contract.options.address)
		)
	}

	private getTransaction(hash: string) {
		return backOff(async () => {
			const value = await this.config.web3.eth.getTransaction(hash)
			if (!value) {
				throw new Error("No transaction found")
			}
			return value
		}, {
			maxDelay: 5000,
			numOfAttempts: 10,
			delayFirstAttempt: true,
			startingDelay: 300,
		})
	}

	async getFrom(): Promise<string> {
		return getFrom(this.config.web3, this.config.from)
	}
}

export class Web3Transaction implements EthereumProvider.EthereumTransaction {
	constructor(
		private readonly receipt: Promise<TransactionReceipt>,
		public readonly hash: Word,
		public readonly data: Binary,
		public readonly nonce: number,
		public readonly from: Address,
		public readonly to?: Address,
		private readonly contractAbi?: AbiItem[],
	) {}

	async wait(): Promise<EthereumProvider.EthereumTransactionReceipt> {
		return await this.receipt
	}

	async getEvents(): Promise<EthereumProvider.EthereumTransactionEvent[]> {
		if (this.to && this.contractAbi) {
			return getTransactionReceiptEvents(
				this.receipt,
				this.to,
				this.contractAbi
			)
		}
		return await getContractMethodReceiptEvents(this.receipt) || []
	}
}

async function getFrom(web3: Web3, from: string | undefined): Promise<string> {
	if (from) {
		return from
	}
	const [first] = await web3.eth.getAccounts()
	if (!first) {
		throw new Error("Wallet is not connected")
	}
	return first
}
