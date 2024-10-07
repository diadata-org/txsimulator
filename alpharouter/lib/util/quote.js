var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Logger } from '@ethersproject/logger';
import { Protocol } from '@uniswap/router-sdk';
import { Percent, TradeType } from '@uniswap/sdk-core';
import dotenv from 'dotenv';
import _ from 'lodash';
import { ID_TO_CHAIN_ID, MapWithLowerCaseKey, nativeOnChain, parseAmount, SwapType, } from "@uniswap/smart-order-router";
import { NATIVE_NAMES_BY_ID, TO_PROTOCOL } from "@uniswap/smart-order-router";
import { BaseCommand } from './Basecommand.js';
dotenv.config();
Logger.globalLogger();
Logger.setLogLevel(Logger.levels.DEBUG);
var Quote = /** @class */ (function (_super) {
    __extends(Quote, _super);
    function Quote() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
    Quote.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    //   async get(
    //     tokenInStr: string,
    //     tokenOutStr: string,
    //     amountStr: string,
    //     recipient: string
    //   ): Promise<any> {
    Quote.prototype.get = function (tokenInStr, tokenOutStr, amountStr, recipient) {
        return __awaiter(this, void 0, void 0, function () {
            var exactIn, exactOut, protocolsStr, chainIdNumb, topN, topNWithBaseTokenInSet, topNTokenInOut, topNSecondHop, topNSecondHopForTokenAddressRaw, topNWithBaseToken, topNDirectSwaps, topNWithEachBaseToken, maxSwapsPerPath, minSplits, maxSplits, distributionPercent, forceMixedRoutes, forceCrossProtocol, debugRouting, enableFeeOnTransferFeeFetching, gasToken, topNSecondHopForTokenAddress, protocols, chainId, log, tokenProvider, router, tokenIn, _a, tokenOut, _b, swapRoutes, amountIn, amountOut, blockNumber, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, estimatedGasUsedGasToken, gasPriceWei, methodParameters, quote, quoteGasAdjusted, routeAmounts, simulationStatus;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        exactIn = true;
                        exactOut = "";
                        protocolsStr = "v2,v3";
                        chainIdNumb = 1;
                        topN = 3;
                        topNWithBaseTokenInSet = false;
                        topNTokenInOut = 2;
                        topNSecondHop = 2;
                        topNSecondHopForTokenAddressRaw = "";
                        topNWithBaseToken = 6;
                        topNDirectSwaps = 2;
                        topNWithEachBaseToken = 2;
                        maxSwapsPerPath = 3;
                        minSplits = 1;
                        maxSplits = 1;
                        distributionPercent = 5;
                        forceMixedRoutes = false;
                        forceCrossProtocol = false;
                        debugRouting = true;
                        enableFeeOnTransferFeeFetching = false;
                        gasToken = false;
                        topNSecondHopForTokenAddress = new MapWithLowerCaseKey();
                        topNSecondHopForTokenAddressRaw.split(',').forEach(function (entry) {
                            if (entry != '') {
                                var entryParts = entry.split('|');
                                if (entryParts.length != 2) {
                                    throw new Error('flag --topNSecondHopForTokenAddressRaw must be in format tokenAddress|topN,...');
                                }
                                var topNForTokenAddress = Number(entryParts[1]);
                                topNSecondHopForTokenAddress.set(entryParts[0], topNForTokenAddress);
                            }
                        });
                        if ((exactIn && exactOut) || (!exactIn && !exactOut)) {
                            throw new Error('Must set either --exactIn or --exactOut.');
                        }
                        protocols = [];
                        if (protocolsStr) {
                            try {
                                protocols = _.map(protocolsStr.split(','), function (protocolStr) {
                                    return TO_PROTOCOL(protocolStr);
                                });
                            }
                            catch (err) {
                                throw new Error("Protocols invalid. Valid options: ".concat(Object.values(Protocol)));
                            }
                        }
                        chainId = ID_TO_CHAIN_ID(chainIdNumb);
                        log = this.logger;
                        tokenProvider = this.tokenProvider;
                        router = this.router;
                        if (!NATIVE_NAMES_BY_ID[chainId].includes(tokenInStr)) return [3 /*break*/, 1];
                        _a = nativeOnChain(chainId);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, tokenProvider.getTokens([tokenInStr])];
                    case 2:
                        _a = (_c.sent()).getTokenByAddress(tokenInStr);
                        _c.label = 3;
                    case 3:
                        tokenIn = _a;
                        if (!NATIVE_NAMES_BY_ID[chainId].includes(tokenOutStr)) return [3 /*break*/, 4];
                        _b = nativeOnChain(chainId);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, tokenProvider.getTokens([tokenOutStr])];
                    case 5:
                        _b = (_c.sent()).getTokenByAddress(tokenOutStr);
                        _c.label = 6;
                    case 6:
                        tokenOut = _b;
                        if (!exactIn) return [3 /*break*/, 8];
                        amountIn = parseAmount(amountStr, tokenIn);
                        return [4 /*yield*/, router.route(amountIn, tokenOut, TradeType.EXACT_INPUT, recipient
                                ? {
                                    type: SwapType.UNIVERSAL_ROUTER,
                                    deadlineOrPreviousBlockhash: 10000000000000,
                                    recipient: recipient,
                                    slippageTolerance: new Percent(5, 100),
                                    simulate: true ? { fromAddress: recipient } : undefined,
                                }
                                : undefined, {
                                blockNumber: this.blockNumber,
                                v3PoolSelection: {
                                    topN: topN,
                                    topNTokenInOut: topNTokenInOut,
                                    topNSecondHop: topNSecondHop,
                                    topNSecondHopForTokenAddress: topNSecondHopForTokenAddress,
                                    topNWithEachBaseToken: topNWithEachBaseToken,
                                    topNWithBaseToken: topNWithBaseToken,
                                    topNWithBaseTokenInSet: topNWithBaseTokenInSet,
                                    topNDirectSwaps: topNDirectSwaps,
                                },
                                maxSwapsPerPath: maxSwapsPerPath,
                                minSplits: minSplits,
                                maxSplits: maxSplits,
                                distributionPercent: distributionPercent,
                                protocols: protocols,
                                forceCrossProtocol: forceCrossProtocol,
                                forceMixedRoutes: forceMixedRoutes,
                                debugRouting: debugRouting,
                                enableFeeOnTransferFeeFetching: enableFeeOnTransferFeeFetching,
                                gasToken: gasToken
                            })];
                    case 7:
                        swapRoutes = _c.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        amountOut = parseAmount(amountStr, tokenOut);
                        return [4 /*yield*/, router.route(amountOut, tokenIn, TradeType.EXACT_OUTPUT, recipient
                                ? {
                                    type: SwapType.SWAP_ROUTER_02,
                                    deadline: 100,
                                    recipient: recipient,
                                    slippageTolerance: new Percent(5, 10000),
                                }
                                : undefined, {
                                blockNumber: this.blockNumber - 10,
                                v3PoolSelection: {
                                    topN: topN,
                                    topNTokenInOut: topNTokenInOut,
                                    topNSecondHop: topNSecondHop,
                                    topNSecondHopForTokenAddress: topNSecondHopForTokenAddress,
                                    topNWithEachBaseToken: topNWithEachBaseToken,
                                    topNWithBaseToken: topNWithBaseToken,
                                    topNWithBaseTokenInSet: topNWithBaseTokenInSet,
                                    topNDirectSwaps: topNDirectSwaps,
                                },
                                maxSwapsPerPath: maxSwapsPerPath,
                                minSplits: minSplits,
                                maxSplits: maxSplits,
                                distributionPercent: distributionPercent,
                                protocols: protocols,
                                forceCrossProtocol: forceCrossProtocol,
                                forceMixedRoutes: forceMixedRoutes,
                                debugRouting: debugRouting,
                                enableFeeOnTransferFeeFetching: enableFeeOnTransferFeeFetching,
                                gasToken: gasToken
                            })];
                    case 9:
                        swapRoutes = _c.sent();
                        _c.label = 10;
                    case 10:
                        if (!swapRoutes) {
                            log.error("Could not find route. ".concat(true ? '' : 'Run in debug mode for more info', "."));
                            return [2 /*return*/];
                        }
                        blockNumber = swapRoutes.blockNumber, estimatedGasUsed = swapRoutes.estimatedGasUsed, estimatedGasUsedQuoteToken = swapRoutes.estimatedGasUsedQuoteToken, estimatedGasUsedUSD = swapRoutes.estimatedGasUsedUSD, estimatedGasUsedGasToken = swapRoutes.estimatedGasUsedGasToken, gasPriceWei = swapRoutes.gasPriceWei, methodParameters = swapRoutes.methodParameters, quote = swapRoutes.quote, quoteGasAdjusted = swapRoutes.quoteGasAdjusted, routeAmounts = swapRoutes.route, simulationStatus = swapRoutes.simulationStatus;
                        this.logSwapResults(routeAmounts, quote, quoteGasAdjusted, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, estimatedGasUsedGasToken, methodParameters, blockNumber, estimatedGasUsed, gasPriceWei, simulationStatus);
                        return [2 /*return*/];
                }
            });
        });
    };
    Quote.description = 'Uniswap Smart Order Router CLI';
    return Quote;
}(BaseCommand));
export { Quote };
