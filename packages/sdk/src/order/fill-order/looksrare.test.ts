import { createE2eProvider } from "@rarible/ethereum-sdk-test-common"
import Web3 from "web3"
import { Web3Ethereum } from "@rarible/web3-ethereum"
import { toAddress, toBinary, ZERO_ADDRESS } from "@rarible/types"
import type { Erc1155AssetType, LooksRareOrder } from "@rarible/ethereum-api-client"
import { EthersEthereum, EthersWeb3ProviderEthereum } from "@rarible/ethers-ethereum"
import { ethers } from "ethers"
import { createRaribleSdk } from "../../index"
import { getEthereumConfig } from "../../config"
import { checkChainId } from "../check-chain-id"
import { getSimpleSendWithInjects } from "../../common/send-transaction"
import { createErc1155V2Collection, createErc721V3Collection } from "../../common/mint"
import { MintResponseTypeEnum } from "../../nft/mint"
import { awaitOwnership } from "../test/await-ownership"
import { FILL_CALLDATA_TAG } from "../../config/common"
import { makeRaribleSellOrder } from "./looksrare-utils/create-order"

describe.skip("looksrare fill", () => {
	const providerConfig = {
		networkId: 4,
		rpcUrl: "https://node-rinkeby.rarible.com",
	}
	const {provider: providerBuyer} = createE2eProvider(
		"0x00120de4b1518cf1f16dc1b02f6b4a8ac29e870174cb1d8575f578480930250a",
		providerConfig
	)
	const {provider: providerSeller} = createE2eProvider(
		"0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c",
		providerConfig
	)
	const {wallet: feeWallet} = createE2eProvider(undefined, providerConfig)
	const web3Seller = new Web3(providerSeller as any)
	const ethereumSeller = new Web3Ethereum({
		web3: web3Seller,
		gas: 3000000,
	})
	const web3 = new Web3(providerBuyer as any)
	const ethereum = new Web3Ethereum({
		web3,
		gas: 3000000,
	})

	const buyerWeb3 = new Web3Ethereum({
		web3: new Web3(providerBuyer as any),
		gas: 3000000,
	})
	const buyerEthersWeb3Provider = new ethers.providers.Web3Provider(providerBuyer as any)

	const buyerEthersWeb3ProviderEthereum = new EthersWeb3ProviderEthereum(buyerEthersWeb3Provider)
	const buyerEthersEthereum =	new EthersEthereum(
		new ethers.Wallet("0x00120de4b1518cf1f16dc1b02f6b4a8ac29e870174cb1d8575f578480930250a", buyerEthersWeb3Provider)
	)

	const sdkBuyer = createRaribleSdk(buyerWeb3, "testnet")
	const sdkSeller = createRaribleSdk(ethereumSeller, "testnet")

	const rinkebyErc721V3ContractAddress = toAddress("0x6ede7f3c26975aad32a475e1021d8f6f39c89d82")
	const rinkebyErc1155V2ContractAddress = toAddress("0x1af7a7555263f275433c6bb0b8fdcd231f89b1d7")
	const originFeeAddress = toAddress(feeWallet.getAddressString())

	const config = getEthereumConfig("testnet")

	const checkWalletChainId = checkChainId.bind(null, ethereum, config)
	const send = getSimpleSendWithInjects().bind(null, checkWalletChainId)

	test.skip("fill erc 721", async () => {
		if (!config.exchange.looksrare) {
			throw new Error("Looksrare contract has not been set")
		}

		const sellItem = await sdkSeller.nft.mint({
			collection: createErc721V3Collection(rinkebyErc721V3ContractAddress),
			uri: "ipfs://ipfs/QmfVqzkQcKR1vCNqcZkeVVy94684hyLki7QcVzd9rmjuG5",
			royalties: [],
			lazy: false,
		})
		if (sellItem.type === MintResponseTypeEnum.ON_CHAIN) {
			await sellItem.transaction.wait()
		}

		const sellOrder = await makeRaribleSellOrder(
			ethereumSeller,
			{
				assetClass: "ERC721",
				contract: sellItem.contract,
				tokenId: sellItem.tokenId,
			},
			send,
			toAddress(config.exchange.looksrare)
		)
		console.log("sellOrder", sellOrder)

		const tx = await sdkBuyer.order.buy({
			order: sellOrder,
			amount: 1,
			originFees: [{
				account: toAddress("0x0d28e9Bd340e48370475553D21Bd0A95c9a60F92"),
				value: 100,
			}, {
				account: toAddress("0xFc7b41fFC023bf3eab6553bf4881D45834EF1E8a"),
				value: 50,
			}],
		})
		console.log(tx)
		await tx.wait()
	})

	test.skip("fill erc 1155", async () => {
		if (!config.exchange.looksrare) {
			throw new Error("Looksrare contract has not been set")
		}

		const sellItem = await sdkSeller.nft.mint({
			collection: createErc1155V2Collection(rinkebyErc1155V2ContractAddress),
			uri: "ipfs://ipfs/QmfVqzkQcKR1vCNqcZkeVVy94684hyLki7QcVzd9rmjuG5",
			royalties: [],
			lazy: false,
			supply: 10,
		})
		if (sellItem.type === MintResponseTypeEnum.ON_CHAIN) {
			await sellItem.transaction.wait()
		}

		const sellOrder = await makeRaribleSellOrder(
			ethereumSeller,
			{
				assetClass: "ERC1155",
				contract: sellItem.contract,
				tokenId: sellItem.tokenId,
			},
			send,
			toAddress(config.exchange.looksrare)
		)

		const seller = toAddress(await ethereumSeller.getFrom())
		const tx = await sdkBuyer.order.buy({
			order: sellOrder,
			amount: 1,
			originFees: [
				{
					account: seller,
					value: 1000,
				},
				{
					account: seller,
					value: 1000,
				},
			],
		})
		await tx.wait()
	})

	test.skip("fill API order", async () => {
		const order = await sdkBuyer.apis.order.getOrderByHash({
			hash: "0x3a7ff5ea8769b18d220f962d215bca2d2667131c2dde5593bb7302a12cd2dda4",
		}) as LooksRareOrder

		const tx = await sdkBuyer.order.buy({
			order,
			amount: 1,
			originFees: [
				{
					account: originFeeAddress,
					value: 1000,
				},
			],
		})
		console.log("tx", tx)
		await tx.wait()

		const assetType = order.make.assetType as Erc1155AssetType
		const itemId = `${assetType.contract}:${assetType.tokenId}`
		await awaitOwnership(sdkBuyer, itemId, toAddress(await buyerWeb3.getFrom()), "1")
	})


	test.each([
		{provider: buyerWeb3, name: "web3"},
		{provider: buyerEthersWeb3ProviderEthereum, name: "ethersWeb3Ethereum"},
		{provider: buyerEthersEthereum, name: "ethersEthereum"},
	])("fill erc 721 $name", async (buyerEthereum) => {
		if (!config.exchange.looksrare) {
			throw new Error("Looksrare contract has not been set")
		}
		const sellItem = await sdkSeller.nft.mint({
			collection: createErc721V3Collection(rinkebyErc721V3ContractAddress),
			uri: "ipfs://ipfs/QmfVqzkQcKR1vCNqcZkeVVy94684hyLki7QcVzd9rmjuG5",
			royalties: [],
			lazy: false,
		})
		if (sellItem.type === MintResponseTypeEnum.ON_CHAIN) {
			await sellItem.transaction.wait()
		}

		const sellOrder = await makeRaribleSellOrder(
			ethereumSeller,
			{
				assetClass: "ERC721",
				contract: sellItem.contract,
				tokenId: sellItem.tokenId,
			},
			send,
			toAddress(config.exchange.looksrare)
		)
		console.log("sellOrder", sellOrder)

		const fillCalldata = toBinary(`${ZERO_ADDRESS}00000009`)
		const sdkBuyer = createRaribleSdk(buyerEthereum.provider, "testnet", {
			fillCalldata,
		})
		const tx = await sdkBuyer.order.buy({
			order: sellOrder,
			amount: 1,
			originFees: [{
				account: toAddress("0x0d28e9Bd340e48370475553D21Bd0A95c9a60F92"),
				value: 100,
			}, {
				account: toAddress("0xFc7b41fFC023bf3eab6553bf4881D45834EF1E8a"),
				value: 50,
			}],
		})
		const fullAdditionalData = fillCalldata.concat(FILL_CALLDATA_TAG).slice(2)
		console.log(tx)
		expect(tx.data.endsWith(fullAdditionalData)).toBe(true)
		await tx.wait()
	})

})
