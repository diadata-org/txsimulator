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
import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';
import { flags } from '@oclif/command';
// import { ParserOutput } from '@oclif/parser/lib/parse';
import * as DEFAULT_TOKEN_LIST from '@uniswap/default-token-list';
import { ChainId } from '@uniswap/sdk-core';
import bunyan from 'bunyan';
import _ from 'lodash';
import NodeCache from 'node-cache';
import { AlphaRouter, CachingGasStationProvider, CachingTokenListProvider, CachingTokenProviderWithFallback, CachingV3PoolProvider, CHAIN_IDS_LIST, EIP1559GasPriceProvider, EthEstimateGasSimulator, FallbackTenderlySimulator, ID_TO_CHAIN_ID, ID_TO_NETWORK_NAME, ID_TO_PROVIDER, LegacyRouter, MetricLogger, NodeJSCache, OnChainQuoteProvider, routeAmountsToString, setGlobalLogger, setGlobalMetric, TenderlySimulator, TokenPropertiesProvider, TokenProvider, UniswapMulticallProvider, V2PoolProvider, V3PoolProvider } from '@uniswap/smart-order-router';
import { LegacyGasPriceProvider } from '@uniswap/smart-order-router';
import { OnChainGasPriceProvider, } from '@uniswap/smart-order-router';
import { PortionProvider } from './portion-provider.js';
import { OnChainTokenFeeFetcher } from './token-fee-fetcher.js';
var BaseCommand = /** @class */ (function () {
    function BaseCommand() {
        this._log = null;
        this._router = null;
        this._swapToRatioRouter = null;
        this._tokenProvider = null;
        this._poolProvider = null;
        this._blockNumber = null;
        this._multicall2Provider = null;
    }
    Object.defineProperty(BaseCommand.prototype, "logger", {
        get: function () {
            return this._log
                ? this._log
                : bunyan.createLogger({
                    name: 'Default Logger',
                });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCommand.prototype, "router", {
        get: function () {
            if (this._router) {
                return this._router;
            }
            else {
                throw 'router not initialized';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCommand.prototype, "swapToRatioRouter", {
        get: function () {
            if (this._swapToRatioRouter) {
                return this._swapToRatioRouter;
            }
            else {
                throw 'swapToRatioRouter not initialized';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCommand.prototype, "tokenProvider", {
        get: function () {
            if (this._tokenProvider) {
                return this._tokenProvider;
            }
            else {
                throw 'tokenProvider not initialized';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCommand.prototype, "poolProvider", {
        get: function () {
            if (this._poolProvider) {
                return this._poolProvider;
            }
            else {
                throw 'poolProvider not initialized';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCommand.prototype, "blockNumber", {
        get: function () {
            if (this._blockNumber) {
                return this._blockNumber;
            }
            else {
                throw 'blockNumber not initialized';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCommand.prototype, "multicall2Provider", {
        get: function () {
            if (this._multicall2Provider) {
                return this._multicall2Provider;
            }
            else {
                throw 'multicall2 not initialized';
            }
        },
        enumerable: false,
        configurable: true
    });
    BaseCommand.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chainId, chainProvider, metricLogger, provider, _a, tokenCache, tokenListProvider, multicall2Provider, tokenProviderOnChain, gasPriceCache, v3PoolProvider, tokenFeeFetcher, tokenPropertiesProvider, v2PoolProvider, portionProvider, tenderlySimulator, ethEstimateGasSimulator, simulator, router;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // const query: ParserOutput<any, any> = this.parse();
                        // const {
                        //   chainId: chainIdNumb,
                        //   router: routerStr,
                        //   debug,
                        //   debugJSON,
                        //   tokenListURI,
                        // } = query.flags;
                        // initialize logger
                        // const logLevel = debug || debugJSON ? bunyan.DEBUG : bunyan.INFO;
                        this._log = bunyan.createLogger({
                            name: 'Uniswap Smart Order Router'
                        });
                        if (false) {
                            setGlobalLogger(this.logger);
                        }
                        chainId = ID_TO_CHAIN_ID(1);
                        chainProvider = ID_TO_PROVIDER(chainId);
                        metricLogger = new MetricLogger({
                            chainId: 1,
                            networkName: ID_TO_NETWORK_NAME(chainId),
                        });
                        setGlobalMetric(metricLogger);
                        provider = new JsonRpcProvider(chainProvider, chainId);
                        _a = this;
                        return [4 /*yield*/, provider.getBlockNumber()];
                    case 1:
                        _a._blockNumber = _c.sent();
                        tokenCache = new NodeJSCache(new NodeCache({ stdTTL: 3600, useClones: false }));
                        if (!false) return [3 /*break*/, 3];
                        return [4 /*yield*/, CachingTokenListProvider.fromTokenListURI(chainId, "tokenListURI", tokenCache)];
                    case 2:
                        tokenListProvider = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, CachingTokenListProvider.fromTokenList(chainId, DEFAULT_TOKEN_LIST, tokenCache)];
                    case 4:
                        tokenListProvider = _c.sent();
                        _c.label = 5;
                    case 5:
                        multicall2Provider = new UniswapMulticallProvider(chainId, provider);
                        this._multicall2Provider = multicall2Provider;
                        this._poolProvider = new V3PoolProvider(chainId, multicall2Provider);
                        tokenProviderOnChain = new TokenProvider(chainId, multicall2Provider);
                        this._tokenProvider = new CachingTokenProviderWithFallback(chainId, tokenCache, tokenListProvider, tokenProviderOnChain);
                        if (false) {
                            this._router = new LegacyRouter({
                                chainId: chainId,
                                multicall2Provider: multicall2Provider,
                                poolProvider: new V3PoolProvider(chainId, multicall2Provider),
                                quoteProvider: new OnChainQuoteProvider(chainId, provider, multicall2Provider),
                                tokenProvider: this.tokenProvider,
                            });
                        }
                        else {
                            gasPriceCache = new NodeJSCache(new NodeCache({ stdTTL: 15, useClones: true }));
                            v3PoolProvider = new CachingV3PoolProvider(chainId, new V3PoolProvider(chainId, multicall2Provider), new NodeJSCache(new NodeCache({ stdTTL: 360, useClones: false })));
                            tokenFeeFetcher = new OnChainTokenFeeFetcher(chainId, provider);
                            tokenPropertiesProvider = new TokenPropertiesProvider(chainId, new NodeJSCache(new NodeCache({ stdTTL: 360, useClones: false })), tokenFeeFetcher);
                            v2PoolProvider = new V2PoolProvider(chainId, multicall2Provider, tokenPropertiesProvider);
                            portionProvider = new PortionProvider();
                            tenderlySimulator = new TenderlySimulator(chainId, 'https://api.tenderly.co', process.env.TENDERLY_USER, process.env.TENDERLY_PROJECT, process.env.TENDERLY_ACCESS_KEY, process.env.TENDERLY_NODE_API_KEY, v2PoolProvider, v3PoolProvider, provider, portionProvider, (_b = {}, _b[ChainId.ARBITRUM_ONE] = 1, _b), 5000, 100, [ChainId.MAINNET]);
                            ethEstimateGasSimulator = new EthEstimateGasSimulator(chainId, provider, v2PoolProvider, v3PoolProvider, portionProvider);
                            simulator = new FallbackTenderlySimulator(chainId, provider, portionProvider, tenderlySimulator, ethEstimateGasSimulator);
                            router = new AlphaRouter({
                                provider: provider,
                                chainId: chainId,
                                multicall2Provider: multicall2Provider,
                                gasPriceProvider: new CachingGasStationProvider(chainId, new OnChainGasPriceProvider(chainId, new EIP1559GasPriceProvider(provider), new LegacyGasPriceProvider(provider)), gasPriceCache),
                                simulator: simulator,
                            });
                            this._swapToRatioRouter = router;
                            this._router = router;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseCommand.prototype.logSwapResults = function (routeAmounts, quote, quoteGasAdjusted, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, estimatedGasUsedGasToken, methodParameters, blockNumber, estimatedGasUsed, gasPriceWei, simulationStatus) {
        this.logger.info("Best Route:");
        this.logger.info("".concat(routeAmountsToString(routeAmounts)));
        this.logger.info("\tRaw Quote Exact In:");
        this.logger.info("\t\t".concat(quote.toFixed(Math.min(quote.currency.decimals, 2))));
        this.logger.info("\tGas Adjusted Quote In:");
        this.logger.info("\t\t".concat(quoteGasAdjusted.toFixed(Math.min(quoteGasAdjusted.currency.decimals, 2))));
        this.logger.info("");
        this.logger.info("Gas Used Quote Token: ".concat(estimatedGasUsedQuoteToken.toFixed(Math.min(estimatedGasUsedQuoteToken.currency.decimals, 6))));
        this.logger.info("Gas Used USD: ".concat(estimatedGasUsedUSD.toFixed(Math.min(estimatedGasUsedUSD.currency.decimals, 6))));
        if (estimatedGasUsedGasToken) {
            this.logger.info("Gas Used gas token: ".concat(estimatedGasUsedGasToken.toFixed(Math.min(estimatedGasUsedGasToken.currency.decimals, 6))));
        }
        this.logger.info("Calldata: ".concat(methodParameters === null || methodParameters === void 0 ? void 0 : methodParameters.calldata));
        this.logger.info("Value: ".concat(methodParameters === null || methodParameters === void 0 ? void 0 : methodParameters.value));
        this.logger.info({
            blockNumber: blockNumber.toString(),
            estimatedGasUsed: estimatedGasUsed.toString(),
            gasPriceWei: gasPriceWei.toString(),
            simulationStatus: simulationStatus,
        });
        var v3Routes = routeAmounts;
        var total = BigNumber.from(0);
        for (var i = 0; i < v3Routes.length; i++) {
            var route = v3Routes[i];
            var tick = BigNumber.from(Math.max(1, _.sum(route.initializedTicksCrossedList)));
            total = total.add(tick);
        }
        this.logger.info("Total ticks crossed: ".concat(total));
    };
    BaseCommand.flags = {
        topN: flags.integer({
            required: false,
            default: 3,
        }),
        topNTokenInOut: flags.integer({
            required: false,
            default: 2,
        }),
        topNSecondHop: flags.integer({
            required: false,
            default: 2,
        }),
        topNSecondHopForTokenAddressRaw: flags.string({
            required: false,
            default: '',
        }),
        topNWithEachBaseToken: flags.integer({
            required: false,
            default: 2,
        }),
        topNWithBaseToken: flags.integer({
            required: false,
            default: 6,
        }),
        topNWithBaseTokenInSet: flags.boolean({
            required: false,
            default: false,
        }),
        topNDirectSwaps: flags.integer({
            required: false,
            default: 2,
        }),
        maxSwapsPerPath: flags.integer({
            required: false,
            default: 3,
        }),
        minSplits: flags.integer({
            required: false,
            default: 1,
        }),
        maxSplits: flags.integer({
            required: false,
            default: 3,
        }),
        distributionPercent: flags.integer({
            required: false,
            default: 5,
        }),
        chainId: flags.integer({
            char: 'c',
            required: false,
            default: ChainId.MAINNET,
            options: CHAIN_IDS_LIST,
        }),
        tokenListURI: flags.string({
            required: false,
        }),
        router: flags.string({
            char: 's',
            required: false,
            default: 'alpha',
        }),
        debug: flags.boolean(),
        debugJSON: flags.boolean(),
    };
    return BaseCommand;
}());
export { BaseCommand };
