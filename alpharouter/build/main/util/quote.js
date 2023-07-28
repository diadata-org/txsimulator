"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
const providers_1 = require("@ethersproject/providers");
const node_cache_1 = __importDefault(require("node-cache"));
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const lodash_1 = __importDefault(require("lodash"));
const smart_order_router_1 = require("@uniswap/smart-order-router");
const smart_order_router_2 = require("@uniswap/smart-order-router");
class Quote {
    async get(tokenInStr, tokenOutStr, amountStr, recipient) {
        var _a, _b, _c, _d;
        console.log("start");
        // let tokenInStr: string = "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b";
        // let tokenOutStr: string = "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419";
        // let amountStr: string = "1100";
        // let recipient: string = "0x5c2765ff150f3e2a44482A5A28d1Ae82aFd74B11";
        let exactIn = true;
        let exactOut = "";
        let protocolsStr = "v2,v3";
        let chainIdNumb = 1;
        let topN = 3;
        let topNTokenInOut = 2;
        let topNSecondHop = 2;
        let topNSecondHopForTokenAddressRaw = "";
        let topNWithBaseToken = 6;
        // let topNWithBaseTokenInSet:boolean=false
        let topNDirectSwaps = 2;
        let topNWithEachBaseToken = 2;
        let maxSwapsPerPath = 3;
        let minSplits = 1;
        let maxSplits = 1;
        let distributionPercent = 5;
        let forceMixedRoutes = false;
        let forceCrossProtocol = false;
        const topNSecondHopForTokenAddress = new smart_order_router_1.MapWithLowerCaseKey();
        topNSecondHopForTokenAddressRaw.split(",").forEach((entry) => {
            if (entry != "") {
                const entryParts = entry.split("|");
                if (entryParts.length != 2) {
                    throw new Error("flag --topNSecondHopForTokenAddressRaw must be in format tokenAddress|topN,...");
                }
                const topNForTokenAddress = Number(entryParts[1]);
                topNSecondHopForTokenAddress.set(entryParts[0], topNForTokenAddress);
            }
        });
        if ((exactIn && exactOut) || (!exactIn && !exactOut)) {
            throw new Error("Must set either --exactIn or --exactOut.");
        }
        let protocols = [];
        if (protocolsStr) {
            try {
                protocols = lodash_1.default.map(protocolsStr.split(","), (protocolStr) => (0, smart_order_router_2.TO_PROTOCOL)(protocolStr));
            }
            catch (err) {
                throw new Error(`Protocols invalid. Valid options: ${Object.values(router_sdk_1.Protocol)}`);
            }
        }
        const chainId = (0, smart_order_router_1.ID_TO_CHAIN_ID)(chainIdNumb);
        const chainProvider = (0, smart_order_router_2.ID_TO_PROVIDER)(chainId);
        const provider = new providers_1.JsonRpcProvider(chainProvider, chainId);
        const multicall2Provider = new smart_order_router_2.UniswapMulticallProvider(chainId, provider);
        const tokenProviderOnChain = new smart_order_router_2.TokenProvider(chainId, multicall2Provider);
        const tokenProvider = tokenProviderOnChain;
        const gasPriceCache = new smart_order_router_2.NodeJSCache(new node_cache_1.default({ stdTTL: 15, useClones: true }));
        const v2PoolProvider = new smart_order_router_2.V2PoolProvider(chainId, multicall2Provider);
        const v3PoolProvider = new smart_order_router_2.CachingV3PoolProvider(chainId, new smart_order_router_2.V3PoolProvider(chainId, multicall2Provider), new smart_order_router_2.NodeJSCache(new node_cache_1.default({ stdTTL: 360, useClones: false })));
        const tenderlySimulator = new smart_order_router_2.TenderlySimulator(chainId, "http://api.tenderly.co", process.env.TENDERLY_USER, process.env.TENDERLY_PROJECT, process.env.TENDERLY_ACCESS_KEY, v2PoolProvider, v3PoolProvider, provider, {});
        const ethEstimateGasSimulator = new smart_order_router_2.EthEstimateGasSimulator(chainId, provider, v2PoolProvider, v3PoolProvider);
        const simulator = new smart_order_router_2.FallbackTenderlySimulator(chainId, provider, tenderlySimulator, ethEstimateGasSimulator);
        let blocknumber = await provider.getBlockNumber();
        const router = new smart_order_router_2.AlphaRouter({
            provider,
            chainId,
            multicall2Provider: multicall2Provider,
            gasPriceProvider: new smart_order_router_2.CachingGasStationProvider(chainId, new smart_order_router_2.OnChainGasPriceProvider(chainId, new smart_order_router_2.EIP1559GasPriceProvider(provider), new smart_order_router_2.LegacyGasPriceProvider(provider)), gasPriceCache),
            simulator,
        });
        // if the tokenIn str is 'ETH' or 'MATIC' or in NATIVE_NAMES_BY_ID
        const tokenIn = smart_order_router_2.NATIVE_NAMES_BY_ID[chainId].includes(tokenInStr)
            ? (0, smart_order_router_1.nativeOnChain)(chainId)
            : (await tokenProvider.getTokens([tokenInStr])).getTokenByAddress(tokenInStr);
        const tokenOut = smart_order_router_2.NATIVE_NAMES_BY_ID[chainId].includes(tokenOutStr)
            ? (0, smart_order_router_1.nativeOnChain)(chainId)
            : (await tokenProvider.getTokens([tokenOutStr])).getTokenByAddress(tokenOutStr);
        let swapRoutes;
        if (exactIn) {
            const amountIn = (0, smart_order_router_1.parseAmount)(amountStr, tokenIn);
            swapRoutes = await router.route(amountIn, tokenOut, sdk_core_1.TradeType.EXACT_INPUT, recipient
                ? {
                    type: smart_order_router_1.SwapType.UNIVERSAL_ROUTER,
                    recipient,
                    slippageTolerance: new sdk_core_1.Percent(5, 100),
                    simulate: false ? { fromAddress: recipient } : undefined,
                }
                : undefined, {
                blockNumber: blocknumber,
                v3PoolSelection: {
                    topN,
                    topNTokenInOut,
                    topNSecondHop,
                    // topNSecondHopForTokenAddress,
                    topNWithEachBaseToken,
                    topNWithBaseToken,
                    // topNWithBaseTokenInSet,
                    topNDirectSwaps,
                },
                maxSwapsPerPath,
                minSplits,
                maxSplits,
                distributionPercent,
                protocols,
                forceCrossProtocol,
                forceMixedRoutes,
            });
            if (!swapRoutes) {
                console.log(`Could not find route.  '' : 'Run in debug mode for more info'
            }.`);
                return;
            }
            console.log("swapRoutes.methodParameters?.calldata", (_a = swapRoutes.methodParameters) === null || _a === void 0 ? void 0 : _a.calldata);
            console.log("swapRoutes.methodParameters?.to", (_b = swapRoutes.methodParameters) === null || _b === void 0 ? void 0 : _b.to);
            console.log("recipient", recipient);
            console.log("blocknumber", blocknumber);
            console.log("status", swapRoutes.simulationStatus);
            let poolAddresses = [];
            swapRoutes.route.forEach((route) => {
                poolAddresses.push(...route.poolAddresses);
            });
            console.log((0, smart_order_router_2.routeAmountsToString)(swapRoutes.route));
            return {
                recipient: recipient,
                to: (_c = swapRoutes.methodParameters) === null || _c === void 0 ? void 0 : _c.to,
                path: poolAddresses,
                data: (_d = swapRoutes.methodParameters) === null || _d === void 0 ? void 0 : _d.calldata
            };
        }
    }
}
exports.Quote = Quote;
Quote.description = "Uniswap Smart Order Router CLI";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVvdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC9xdW90ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBMkQ7QUFDM0QsNERBQW1DO0FBQ25DLG9EQUErQztBQUMvQyxnREFBaUU7QUFDakUsb0RBQXVCO0FBRXZCLG9FQU9xQztBQUVyQyxvRUFvQnFDO0FBRXJDLE1BQWEsS0FBSztJQUdoQixLQUFLLENBQUMsR0FBRyxDQUNQLFVBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLFNBQWlCLEVBQ2pCLFNBQWlCOztRQUVqQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJCLHlFQUF5RTtRQUN6RSwwRUFBMEU7UUFDMUUsa0NBQWtDO1FBQ2xDLHdFQUF3RTtRQUV4RSxJQUFJLE9BQU8sR0FBWSxJQUFJLENBQUM7UUFDNUIsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFDO1FBQzFCLElBQUksWUFBWSxHQUFXLE9BQU8sQ0FBQztRQUNuQyxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7UUFDNUIsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQztRQUMvQixJQUFJLGFBQWEsR0FBVyxDQUFDLENBQUM7UUFDOUIsSUFBSSwrQkFBK0IsR0FBVyxFQUFFLENBQUM7UUFDakQsSUFBSSxpQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFDbEMsMkNBQTJDO1FBQzNDLElBQUksZUFBZSxHQUFXLENBQUMsQ0FBQztRQUNoQyxJQUFJLHFCQUFxQixHQUFXLENBQUMsQ0FBQztRQUN0QyxJQUFJLGVBQWUsR0FBVyxDQUFDLENBQUM7UUFDaEMsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLElBQUksU0FBUyxHQUFXLENBQUMsQ0FBQztRQUMxQixJQUFJLG1CQUFtQixHQUFXLENBQUMsQ0FBQztRQUNwQyxJQUFJLGdCQUFnQixHQUFZLEtBQUss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