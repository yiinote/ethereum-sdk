import type { Address } from "@rarible/ethereum-api-client"
import type { Ethereum, EthereumContract } from "@rarible/ethereum-provider"
import type { AbiItem } from "../../common/abi-item"

export function createExchangeV2Contract(ethereum: Ethereum, address?: Address): EthereumContract {
	return ethereum.createContract(EXCHANGEV2_ABI, address)
}

export const EXCHANGEV2_ABI: AbiItem[] = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32",
			},
		],
		"name": "Cancel",
		"type": "event",
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "leftHash",
				"type": "bytes32",
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "rightHash",
				"type": "bytes32",
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newLeftFill",
				"type": "uint256",
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRightFill",
				"type": "uint256",
			},
		],
		"name": "Match",
		"type": "event",
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes4",
				"name": "assetType",
				"type": "bytes4",
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "matcher",
				"type": "address",
			},
		],
		"name": "MatcherChange",
		"type": "event",
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address",
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address",
			},
		],
		"name": "OwnershipTransferred",
		"type": "event",
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "oldValue",
				"type": "uint256",
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newValue",
				"type": "uint256",
			},
		],
		"name": "ProtocolFeeChanged",
		"type": "event",
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes4",
				"name": "assetType",
				"type": "bytes4",
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "proxy",
				"type": "address",
			},
		],
		"name": "ProxyChange",
		"type": "event",
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "maker",
						"type": "address",
					},
					{
						"components": [
							{
								"components": [
									{
										"internalType": "bytes4",
										"name": "assetClass",
										"type": "bytes4",
									},
									{
										"internalType": "bytes",
										"name": "data",
										"type": "bytes",
									},
								],
								"internalType": "struct LibAsset.AssetType",
								"name": "assetType",
								"type": "tuple",
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256",
							},
						],
						"internalType": "struct LibAsset.Asset",
						"name": "makeAsset",
						"type": "tuple",
					},
					{
						"internalType": "address",
						"name": "taker",
						"type": "address",
					},
					{
						"components": [
							{
								"components": [
									{
										"internalType": "bytes4",
										"name": "assetClass",
										"type": "bytes4",
									},
									{
										"internalType": "bytes",
										"name": "data",
										"type": "bytes",
									},
								],
								"internalType": "struct LibAsset.AssetType",
								"name": "assetType",
								"type": "tuple",
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256",
							},
						],
						"internalType": "struct LibAsset.Asset",
						"name": "takeAsset",
						"type": "tuple",
					},
					{
						"internalType": "uint256",
						"name": "salt",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "start",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "end",
						"type": "uint256",
					},
					{
						"internalType": "bytes4",
						"name": "dataType",
						"type": "bytes4",
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes",
					},
				],
				"internalType": "struct LibOrder.Order",
				"name": "order",
				"type": "tuple",
			},
		],
		"name": "cancel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [],
		"name": "defaultFeeReceiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address",
			},
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true,
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tokenBidAmount",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "tokenAcceptAmount",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "priceBid",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "priceAccept",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "salt",
						"type": "uint256",
					},
					{
						"internalType": "address",
						"name": "buyer",
						"type": "address",
					},
					{
						"internalType": "bytes4",
						"name": "nftClass",
						"type": "bytes4",
					},
					{
						"internalType": "bytes",
						"name": "nftData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "paymentData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "bidOrderData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "acceptOrderData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes",
					},
				],
				"internalType": "struct LibDirectTransfer.AcceptBid",
				"name": "direct",
				"type": "tuple",
			},
		],
		"name": "directAcceptBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function",
		"payable": true,
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tokenSellAmount",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "tokenPurchaseAmount",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "priceSell",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "pricePurchase",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "salt",
						"type": "uint256",
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address",
					},
					{
						"internalType": "bytes4",
						"name": "nftClass",
						"type": "bytes4",
					},
					{
						"internalType": "bytes4",
						"name": "paymentClass",
						"type": "bytes4",
					},
					{
						"internalType": "bytes",
						"name": "nftData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "paymentData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "sellOrderData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "purchaseOrderData",
						"type": "bytes",
					},
					{
						"internalType": "bytes",
						"name": "signature",
						"type": "bytes",
					},
				],
				"internalType": "struct LibDirectTransfer.Purchase",
				"name": "direct",
				"type": "tuple",
			},
		],
		"name": "directPurchase",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function",
		"payable": true,
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address",
			},
		],
		"name": "feeReceivers",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address",
			},
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true,
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32",
			},
		],
		"name": "fills",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256",
			},
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true,
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "maker",
						"type": "address",
					},
					{
						"components": [
							{
								"components": [
									{
										"internalType": "bytes4",
										"name": "assetClass",
										"type": "bytes4",
									},
									{
										"internalType": "bytes",
										"name": "data",
										"type": "bytes",
									},
								],
								"internalType": "struct LibAsset.AssetType",
								"name": "assetType",
								"type": "tuple",
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256",
							},
						],
						"internalType": "struct LibAsset.Asset",
						"name": "makeAsset",
						"type": "tuple",
					},
					{
						"internalType": "address",
						"name": "taker",
						"type": "address",
					},
					{
						"components": [
							{
								"components": [
									{
										"internalType": "bytes4",
										"name": "assetClass",
										"type": "bytes4",
									},
									{
										"internalType": "bytes",
										"name": "data",
										"type": "bytes",
									},
								],
								"internalType": "struct LibAsset.AssetType",
								"name": "assetType",
								"type": "tuple",
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256",
							},
						],
						"internalType": "struct LibAsset.Asset",
						"name": "takeAsset",
						"type": "tuple",
					},
					{
						"internalType": "uint256",
						"name": "salt",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "start",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "end",
						"type": "uint256",
					},
					{
						"internalType": "bytes4",
						"name": "dataType",
						"type": "bytes4",
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes",
					},
				],
				"internalType": "struct LibOrder.Order",
				"name": "orderLeft",
				"type": "tuple",
			},
			{
				"internalType": "bytes",
				"name": "signatureLeft",
				"type": "bytes",
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "maker",
						"type": "address",
					},
					{
						"components": [
							{
								"components": [
									{
										"internalType": "bytes4",
										"name": "assetClass",
										"type": "bytes4",
									},
									{
										"internalType": "bytes",
										"name": "data",
										"type": "bytes",
									},
								],
								"internalType": "struct LibAsset.AssetType",
								"name": "assetType",
								"type": "tuple",
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256",
							},
						],
						"internalType": "struct LibAsset.Asset",
						"name": "makeAsset",
						"type": "tuple",
					},
					{
						"internalType": "address",
						"name": "taker",
						"type": "address",
					},
					{
						"components": [
							{
								"components": [
									{
										"internalType": "bytes4",
										"name": "assetClass",
										"type": "bytes4",
									},
									{
										"internalType": "bytes",
										"name": "data",
										"type": "bytes",
									},
								],
								"internalType": "struct LibAsset.AssetType",
								"name": "assetType",
								"type": "tuple",
							},
							{
								"internalType": "uint256",
								"name": "value",
								"type": "uint256",
							},
						],
						"internalType": "struct LibAsset.Asset",
						"name": "takeAsset",
						"type": "tuple",
					},
					{
						"internalType": "uint256",
						"name": "salt",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "start",
						"type": "uint256",
					},
					{
						"internalType": "uint256",
						"name": "end",
						"type": "uint256",
					},
					{
						"internalType": "bytes4",
						"name": "dataType",
						"type": "bytes4",
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes",
					},
				],
				"internalType": "struct LibOrder.Order",
				"name": "orderRight",
				"type": "tuple",
			},
			{
				"internalType": "bytes",
				"name": "signatureRight",
				"type": "bytes",
			},
		],
		"name": "matchOrders",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function",
		"payable": true,
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address",
			},
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true,
	},
	{
		"inputs": [],
		"name": "protocolFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256",
			},
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true,
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [],
		"name": "royaltiesRegistry",
		"outputs": [
			{
				"internalType": "contract IRoyaltiesProvider",
				"name": "",
				"type": "address",
			},
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true,
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "assetType",
				"type": "bytes4",
			},
			{
				"internalType": "address",
				"name": "matcher",
				"type": "address",
			},
		],
		"name": "setAssetMatcher",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "newDefaultFeeReceiver",
				"type": "address",
			},
		],
		"name": "setDefaultFeeReceiver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address",
			},
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address",
			},
		],
		"name": "setFeeReceiver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_protocolFee",
				"type": "uint64",
			},
		],
		"name": "setProtocolFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "contract IRoyaltiesProvider",
				"name": "newRoyaltiesRegistry",
				"type": "address",
			},
		],
		"name": "setRoyaltiesRegistry",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "assetType",
				"type": "bytes4",
			},
			{
				"internalType": "address",
				"name": "proxy",
				"type": "address",
			},
		],
		"name": "setTransferProxy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address",
			},
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_transferProxy",
				"type": "address",
			},
			{
				"internalType": "address",
				"name": "_erc20TransferProxy",
				"type": "address",
			},
			{
				"internalType": "uint256",
				"name": "newProtocolFee",
				"type": "uint256",
			},
			{
				"internalType": "address",
				"name": "newDefaultFeeReceiver",
				"type": "address",
			},
			{
				"internalType": "contract IRoyaltiesProvider",
				"name": "newRoyaltiesProvider",
				"type": "address",
			},
		],
		"name": "__ExchangeV2_init",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function",
	},
]
