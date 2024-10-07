import { Logger } from '@ethersproject/logger';
import { flags } from '@oclif/command';
import { Protocol } from '@uniswap/router-sdk';
import { Currency, Percent, TradeType } from '@uniswap/sdk-core';
import dotenv from 'dotenv';
import _ from 'lodash';

import { ID_TO_CHAIN_ID, MapWithLowerCaseKey, nativeOnChain, parseAmount, SwapRoute, SwapType, } from "@uniswap/smart-order-router";
import { NATIVE_NAMES_BY_ID, TO_PROTOCOL } from "@uniswap/smart-order-router";
import { BaseCommand } from './Basecommand.js';


dotenv.config();

Logger.globalLogger();
Logger.setLogLevel(Logger.levels.DEBUG);

export class Quote extends BaseCommand  {
  static description = 'Uniswap Smart Order Router CLI';

//   static flags = {
//     ...BaseCommand.flags,
//     version: flags.version({ char: 'v' }),
//     help: flags.help({ char: 'h' }),
//     tokenIn: flags.string({ char: 'i', required: true }),
//     tokenOut: flags.string({ char: 'o', required: true }),
//     recipient: flags.string({ required: false }),
//     amount: flags.string({ char: 'a', required: true }),
//     exactIn: flags.boolean({ required: false }),
//     exactOut: flags.boolean({ required: false }),
//     protocols: flags.string({ required: false }),
//     forceCrossProtocol: flags.boolean({ required: false, default: false }),
//     forceMixedRoutes: flags.boolean({
//       required: false,
//       default: false,
//     }),
//     simulate: flags.boolean({ required: false, default: false }),
//     debugRouting: flags.boolean({ required: false, default: true }),
//     enableFeeOnTransferFeeFetching: flags.boolean({ required: false, default: false }),
//     requestBlockNumber: flags.integer({ required: false }),
//     gasToken: flags.string({ required: false }),
//   };

  async run(){}

//   async get(
//     tokenInStr: string,
//     tokenOutStr: string,
//     amountStr: string,
//     recipient: string
//   ): Promise<any> {

  async get(  tokenInStr: string,
       tokenOutStr: string,
        amountStr: string,
        recipient: string) {
    // const { flags } = this.parse(Quote);
    // const {
    //    exactIn,
    //   exactOut,
    //    debug,
    //   topN,
    //   topNTokenInOut,
    //   topNSecondHop,
    //   topNSecondHopForTokenAddressRaw,
    //   topNWithEachBaseToken,
    //   topNWithBaseToken,
    //   topNWithBaseTokenInSet,
    //   topNDirectSwaps,
    //   maxSwapsPerPath,
    //   minSplits,
    //   maxSplits,
    //   distributionPercent,
    //   chainId: chainIdNumb,
    //   protocols: protocolsStr,
    //   forceCrossProtocol,
    //   forceMixedRoutes,
    //   simulate,
    //   debugRouting,
    //   enableFeeOnTransferFeeFetching,
    //   requestBlockNumber,
    //   gasToken
    // } = flags;

        let exactIn: boolean = true;
    let exactOut: string = "";
    let protocolsStr: string = "v2,v3";
    let chainIdNumb: number = 1;
    let topN: number = 3;
    let topNWithBaseTokenInSet:boolean = false
    let topNTokenInOut: number = 2;
    let topNSecondHop: number = 2;
    let topNSecondHopForTokenAddressRaw: string = "";
    let topNWithBaseToken: number = 6;
    // let topNWithBaseTokenInSet:boolean=false
    let topNDirectSwaps: number = 2;
    let topNWithEachBaseToken: number = 2;
    let maxSwapsPerPath: number = 3;
    let minSplits: number = 1;
    let maxSplits: number = 1;
    let distributionPercent: number = 5;
    let forceMixedRoutes: boolean = false;
    let forceCrossProtocol: boolean = false;
    let debugRouting:boolean = true;
    let enableFeeOnTransferFeeFetching:boolean = false;
    let gasToken:boolean = false


    const topNSecondHopForTokenAddress = new MapWithLowerCaseKey();
    topNSecondHopForTokenAddressRaw.split(',').forEach((entry) => {
      if (entry != '') {
        const entryParts = entry.split('|');
        if (entryParts.length != 2) {
          throw new Error(
            'flag --topNSecondHopForTokenAddressRaw must be in format tokenAddress|topN,...');
        }
        const topNForTokenAddress: number = Number(entryParts[1]!);
        topNSecondHopForTokenAddress.set(entryParts[0]!, topNForTokenAddress);
      }
    });

    if ((exactIn && exactOut) || (!exactIn && !exactOut)) {
      throw new Error('Must set either --exactIn or --exactOut.');
    }

    let protocols: Protocol[] = [];
    if (protocolsStr) {
      try {
        protocols = _.map(protocolsStr.split(','), (protocolStr) =>
          TO_PROTOCOL(protocolStr)
        );
      } catch (err) {
        throw new Error(
          `Protocols invalid. Valid options: ${Object.values(Protocol)}`
        );
      }
    }

    const chainId = ID_TO_CHAIN_ID(chainIdNumb);

    const log = this.logger;
    const tokenProvider = this.tokenProvider;
    const router = this.router;

    // if the tokenIn str is 'ETH' or 'MATIC' or in NATIVE_NAMES_BY_ID
    const tokenIn: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(tokenInStr)
      ? nativeOnChain(chainId)
      : (await tokenProvider.getTokens([tokenInStr])).getTokenByAddress(
        tokenInStr
      )!;

    const tokenOut: Currency = NATIVE_NAMES_BY_ID[chainId]!.includes(
      tokenOutStr
    )
      ? nativeOnChain(chainId)
      : (await tokenProvider.getTokens([tokenOutStr])).getTokenByAddress(
        tokenOutStr
      )!;

    let swapRoutes: SwapRoute | null;
    if (exactIn) {
      const amountIn = parseAmount(amountStr, tokenIn);
      swapRoutes = await router.route(
        amountIn,
        tokenOut,
        TradeType.EXACT_INPUT,
        recipient
          ? {
            type: SwapType.UNIVERSAL_ROUTER,
            deadlineOrPreviousBlockhash: 10000000000000,
            recipient,
            slippageTolerance: new Percent(5, 100),
            simulate: true ? { fromAddress: recipient } : undefined,
          }
          : undefined,
        {
          blockNumber:  this.blockNumber,
          v3PoolSelection: {
            topN,
            topNTokenInOut,
            topNSecondHop,
            topNSecondHopForTokenAddress,
            topNWithEachBaseToken,
            topNWithBaseToken,
            topNWithBaseTokenInSet,
            topNDirectSwaps,
          },
          maxSwapsPerPath,
          minSplits,
          maxSplits,
          distributionPercent,
          protocols,
          forceCrossProtocol,
          forceMixedRoutes,
          debugRouting,
          enableFeeOnTransferFeeFetching,
          gasToken
        }
      );
    } else {
      const amountOut = parseAmount(amountStr, tokenOut);
      swapRoutes = await router.route(
        amountOut,
        tokenIn,
        TradeType.EXACT_OUTPUT,
        recipient
          ? {
            type: SwapType.SWAP_ROUTER_02,
            deadline: 100,
            recipient,
            slippageTolerance: new Percent(5, 10_000),
          }
          : undefined,
        {
          blockNumber: this.blockNumber - 10,
          v3PoolSelection: {
            topN,
            topNTokenInOut,
            topNSecondHop,
            topNSecondHopForTokenAddress,
            topNWithEachBaseToken,
            topNWithBaseToken,
            topNWithBaseTokenInSet,
            topNDirectSwaps,
          },
          maxSwapsPerPath,
          minSplits,
          maxSplits,
          distributionPercent,
          protocols,
          forceCrossProtocol,
          forceMixedRoutes,
          debugRouting,
          enableFeeOnTransferFeeFetching,
          gasToken
        }
      );
    }

    if (!swapRoutes) {
      log.error(
        `Could not find route. ${
          true ? '' : 'Run in debug mode for more info'
        }.`
      );
      return;
    }

    const {
      blockNumber,
      estimatedGasUsed,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      estimatedGasUsedGasToken,
      gasPriceWei,
      methodParameters,
      quote,
      quoteGasAdjusted,
      route: routeAmounts,
      simulationStatus,
    } = swapRoutes;

    this.logSwapResults(
      routeAmounts,
      quote,
      quoteGasAdjusted,
      estimatedGasUsedQuoteToken,
      estimatedGasUsedUSD,
      estimatedGasUsedGasToken,
      methodParameters,
      blockNumber,
      estimatedGasUsed,
      gasPriceWei,
      simulationStatus
    );
  }
}
