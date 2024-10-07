// import { JsonRpcProvider } from "@ethersproject/providers";
// import NodeCache from "node-cache";
// import { Protocol } from "@uniswap/router-sdk";
// import { Currency, Percent, TradeType } from "@uniswap/sdk-core";
// import _ from "lodash";

// import {
//   ID_TO_CHAIN_ID,
//   MapWithLowerCaseKey,
//   nativeOnChain,
//   parseAmount,
//   SwapRoute,
//   SwapType,
// } from "@uniswap/smart-order-router";

// import {
//   NATIVE_NAMES_BY_ID,
//   TO_PROTOCOL,
//   ID_TO_PROVIDER,
//   AlphaRouter,
//   TokenProvider,
//   UniswapMulticallProvider,
//   CachingGasStationProvider,
//   OnChainGasPriceProvider,
//   EIP1559GasPriceProvider,
//   LegacyGasPriceProvider,
//   GasPrice,
//   NodeJSCache,
//   TenderlySimulator,
//   EthEstimateGasSimulator,
//   FallbackTenderlySimulator,
//   V2PoolProvider,
//   CachingV3PoolProvider,
//   V3PoolProvider,
//   routeAmountsToString,
// } from "@uniswap/smart-order-router";


// export class UniswapQuote {

//   get logger() {
//     return this._log
//       ? this._log
//       : bunyan.createLogger({
//         name: 'Default Logger',
//       });
//   }
  
//   static description = "Uniswap Smart Order Router CLI";
//    async get(
//     tokenInStr: string,
//     tokenOutStr: string,
//     amountStr: string,
//     recipient: string
//   ): Promise<any> {
//     console.log("start");

//     // let tokenInStr: string = "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b";
//     // let tokenOutStr: string = "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419";
//     // let amountStr: string = "1100";
//     // let recipient: string = "0x5c2765ff150f3e2a44482A5A28d1Ae82aFd74B11";

//     let exactIn: boolean = true;
//     let exactOut: string = "";
//     let protocolsStr: string = "v2,v3";
//     let chainIdNumb: number = 1;
//     let topN: number = 3;
//     let topNTokenInOut: number = 2;
//     let topNSecondHop: number = 2;
//     let topNSecondHopForTokenAddressRaw: string = "";
//     let topNWithBaseToken: number = 6;
//     // let topNWithBaseTokenInSet:boolean=false
//     let topNDirectSwaps: number = 2;
//     let topNWithEachBaseToken: number = 2;
//     let maxSwapsPerPath: number = 3;
//     let minSplits: number = 1;
//     let maxSplits: number = 1;
//     let distributionPercent: number = 5;
//     let forceMixedRoutes: boolean = false;
//     let forceCrossProtocol: boolean = false;

//     const topNSecondHopForTokenAddress = new MapWithLowerCaseKey();
//     topNSecondHopForTokenAddressRaw.split(",").forEach((entry) => {
//       if (entry != "") {
//         const entryParts = entry.split("|");
//         if (entryParts.length != 2) {
//           throw new Error(
//             "flag --topNSecondHopForTokenAddressRaw must be in format tokenAddress|topN,..."
//           );
//         }
//         const topNForTokenAddress: number = Number(entryParts[1]!);
//         topNSecondHopForTokenAddress.set(entryParts[0]!, topNForTokenAddress);
//       }
//     });

//     if ((exactIn && exactOut) || (!exactIn && !exactOut)) {
//       throw new Error("Must set either --exactIn or --exactOut.");
//     }

//     let protocols: Protocol[] = [];
//     if (protocolsStr) {
//       try {
//         protocols = _.map(protocolsStr.split(","), (protocolStr) =>
//           TO_PROTOCOL(protocolStr)
//         );
//       } catch (err) {
//         throw new Error(
//           `Protocols invalid. Valid options: ${Object.values(Protocol)}`
//         );
//       }
//     }

//     const chainId = ID_TO_CHAIN_ID(chainIdNumb);
//     const log = this.logger;

//     const chainProvider = ID_TO_PROVIDER(chainId);
//     const provider = new JsonRpcProvider(chainProvider, chainId);

//     const multicall2Provider = new UniswapMulticallProvider(chainId, provider);
//     const tokenProviderOnChain = new TokenProvider(chainId, multicall2Provider);

//      const tokenProvider = tokenProviderOnChain;
//      const gasPriceCache = new NodeJSCache<GasPrice>(
//       new NodeCache({ stdTTL: 15, useClones: true })
//     );
//     const v2PoolProvider = new V2PoolProvider(chainId, multicall2Provider);

//     const v3PoolProvider = new CachingV3PoolProvider(
//       chainId,
//       new V3PoolProvider(chainId, multicall2Provider),
//       new NodeJSCache(new NodeCache({ stdTTL: 360, useClones: false }))
//     );

//     const tenderlySimulator = new TenderlySimulator(
//       chainId,
//       "http://api.tenderly.co",
//       process.env.TENDERLY_USER!,
//       process.env.TENDERLY_PROJECT!,
//       process.env.TENDERLY_ACCESS_KEY!,
//       v2PoolProvider,
//       v3PoolProvider,
//       provider,
//       {}
//     );

//     const ethEstimateGasSimulator = new EthEstimateGasSimulator(
//       chainId,
//       provider,
//       v2PoolProvider,
//       v3PoolProvider
//     );

//     const simulator = new FallbackTenderlySimulator(
//       chainId,
//       provider,
//       tenderlySimulator,
//       ethEstimateGasSimulator
//     );

//     let blocknumber = await provider.getBlockNumber();

//     const router = new AlphaRouter({
//       provider,
//       chainId,
//       multicall2Provider: multicall2Provider,
//       gasPriceProvider: new CachingGasStationProvider(
//         chainId,
//         new OnChainGasPriceProvider(
//           chainId,
//           new EIP1559GasPriceProvider(provider),
//           new LegacyGasPriceProvider(provider)
//         ),
//         gasPriceCache
//       ),
//       simulator,
//     });

//     // if the tokenIn str is 'ETH' or 'MATIC' or in NATIVE_NAMES_BY_ID
//     const tokenIn: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(tokenInStr)
//       ? nativeOnChain(chainId)
//       : (await tokenProvider.getTokens([tokenInStr])).getTokenByAddress(
//           tokenInStr
//         )!;

//     const tokenOut: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(
//       tokenOutStr
//     )
//       ? nativeOnChain(chainId)
//       : (await tokenProvider.getTokens([tokenOutStr])).getTokenByAddress(
//           tokenOutStr
//         )!;

//     let swapRoutes: SwapRoute | null;
//     if (exactIn) {
//       const amountIn = parseAmount(amountStr, tokenIn);

//       swapRoutes = await router.route(
//         amountIn,
//         tokenOut,
//         TradeType.EXACT_INPUT,
//         recipient
//           ? {
//               type: SwapType.UNIVERSAL_ROUTER,
//               recipient,
//               slippageTolerance: new Percent(5, 100),
//               simulate: false ? { fromAddress: recipient } : undefined,
//             }
//           : undefined,
//         {
//           blockNumber: blocknumber,
//           v3PoolSelection: {
//             topN,
//             topNTokenInOut,
//             topNSecondHop,
//             // topNSecondHopForTokenAddress,
//             topNWithEachBaseToken,
//             topNWithBaseToken,
//             // topNWithBaseTokenInSet,
//             topNDirectSwaps,
//           },
//           maxSwapsPerPath,
//           minSplits,
//           maxSplits,
//           distributionPercent,
//           protocols,
//           forceCrossProtocol,
//           forceMixedRoutes,
//         }
//       );
//       if (!swapRoutes) {
//         console.log(
//           `Could not find route.  '' : 'Run in debug mode for more info'
//             }.`
//         );
//         return;
//       }

//       console.log(
//         "swapRoutes.methodParameters?.calldata",
//         swapRoutes.methodParameters?.calldata
//       );
//       console.log(
//         "swapRoutes.methodParameters?.to",
//         swapRoutes.methodParameters?.to
//       );
//       console.log("recipient", recipient);
//       console.log("blocknumber", blocknumber);
//       console.log("status", swapRoutes.simulationStatus);

//       let poolAddresses: string[] = [];

//       swapRoutes.route.forEach((route) => {
//         poolAddresses.push(...route.poolAddresses);
//       });

//       console.log(routeAmountsToString(swapRoutes.route));

//       return {
//         recipient: recipient,
//         to: swapRoutes.methodParameters?.to,
//         path: poolAddresses,
//         data:swapRoutes.methodParameters?.calldata
//       };
//     }
//   }
// }
