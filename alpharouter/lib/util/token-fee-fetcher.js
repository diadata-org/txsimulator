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
import { ChainId } from '@uniswap/sdk-core';
import { log, metric, MetricLoggerUnit, WRAPPED_NATIVE_CURRENCY, } from '@uniswap/smart-order-router';
var DEFAULT_TOKEN_BUY_FEE_BPS = BigNumber.from(0);
var DEFAULT_TOKEN_SELL_FEE_BPS = BigNumber.from(0);
// on detector failure, assume no fee
export var DEFAULT_TOKEN_FEE_RESULT = {
    buyFeeBps: DEFAULT_TOKEN_BUY_FEE_BPS,
    sellFeeBps: DEFAULT_TOKEN_SELL_FEE_BPS,
};
// address at which the FeeDetector lens is deployed
var FEE_DETECTOR_ADDRESS = function (chainId) {
    switch (chainId) {
        case ChainId.MAINNET:
            return '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f';
        case ChainId.OPTIMISM:
            return '0xa7c17505B43955A474fb6AFE61E093907a7567c9';
        case ChainId.BNB:
            return '0x331f6D0AAB4A1F039f0d75A613a7F1593DbDE1BB';
        case ChainId.POLYGON:
            return '0x92bCCCb6c8c199AAcA38408621E38Ab6dBfA00B5';
        case ChainId.BASE:
            return '0x331f6D0AAB4A1F039f0d75A613a7F1593DbDE1BB';
        case ChainId.ARBITRUM_ONE:
            return '0x64CF365CC5CCf5E64380bc05Acd5df7D0618c118';
        case ChainId.CELO:
            return '0x3dfF0145E68a5880EAbE8F56b6Bc30C4AdCF3413';
        case ChainId.AVALANCHE:
            return '0xBF2B9F6A6eCc4541b31ab2dCF8156D33644Ca3F3';
        default:
            // just default to mainnet contract
            return '0x19C97dc2a25845C7f9d1d519c8C2d4809c58b43f';
    }
};
// Amount has to be big enough to avoid rounding errors, but small enough that
// most v2 pools will have at least this many token units
// 100000 is the smallest number that avoids rounding errors in bps terms
// 10000 was not sufficient due to rounding errors for rebase token (e.g. stETH)
var AMOUNT_TO_FLASH_BORROW = '100000';
// 1M gas limit per validate call, should cover most swap cases
var GAS_LIMIT_PER_VALIDATE = 1000000;
var OnChainTokenFeeFetcher = /** @class */ (function () {
    //   private readonly contract: TokenFeeDetector;
    function OnChainTokenFeeFetcher(chainId, rpcProvider, tokenFeeAddress, gasLimitPerCall, amountToFlashBorrow) {
        if (tokenFeeAddress === void 0) { tokenFeeAddress = FEE_DETECTOR_ADDRESS(chainId); }
        if (gasLimitPerCall === void 0) { gasLimitPerCall = GAS_LIMIT_PER_VALIDATE; }
        if (amountToFlashBorrow === void 0) { amountToFlashBorrow = AMOUNT_TO_FLASH_BORROW; }
        var _a;
        this.chainId = chainId;
        this.tokenFeeAddress = tokenFeeAddress;
        this.gasLimitPerCall = gasLimitPerCall;
        this.amountToFlashBorrow = amountToFlashBorrow;
        this.BASE_TOKEN = (_a = WRAPPED_NATIVE_CURRENCY[this.chainId]) === null || _a === void 0 ? void 0 : _a.address;
        // this.contract = null
    }
    OnChainTokenFeeFetcher.prototype.fetchFees = function (addresses, providerConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenToResult, addressesWithoutBaseToken, functionParams, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenToResult = {};
                        addressesWithoutBaseToken = addresses.filter(function (address) { return address.toLowerCase() !== _this.BASE_TOKEN.toLowerCase(); });
                        functionParams = addressesWithoutBaseToken.map(function (address) { return [
                            address,
                            _this.BASE_TOKEN,
                            _this.amountToFlashBorrow,
                        ]; });
                        return [4 /*yield*/, Promise.all(functionParams.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                var address = _b[0], baseToken = _b[1], amountToBorrow = _b[2];
                                return __generator(this, function (_c) {
                                    try {
                                        // We use the validate function instead of batchValidate to avoid poison pill problem.
                                        // One token that consumes too much gas could cause the entire batch to fail.
                                        //   const feeResult = await this.contract.callStatic.validate(
                                        //     address,
                                        //     baseToken,
                                        //     amountToBorrow,
                                        //     {
                                        //       gasLimit: this.gasLimitPerCall,
                                        //       blockTag: providerConfig?.blockNumber,
                                        //     }
                                        //   );
                                        //   metric.putMetric(
                                        //     'TokenFeeFetcherFetchFeesSuccess',
                                        //     1,
                                        //     MetricLoggerUnit.Count
                                        //   );
                                        return [2 /*return*/, { address: address }];
                                    }
                                    catch (err) {
                                        log.error({ err: err }, "Error calling validate on-chain for token ".concat(address));
                                        metric.putMetric('TokenFeeFetcherFetchFeesFailure', 1, MetricLoggerUnit.Count);
                                        // in case of FOT token fee fetch failure, we return null
                                        // so that they won't get returned from the token-fee-fetcher
                                        // and thus no fee will be applied, and the cache won't cache on FOT tokens with failed fee fetching
                                        return [2 /*return*/, { address: address, buyFeeBps: undefined, sellFeeBps: undefined }];
                                    }
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 1:
                        results = _a.sent();
                        results.forEach(function (_a) {
                            var address = _a.address, buyFeeBps = _a.buyFeeBps, sellFeeBps = _a.sellFeeBps;
                            if (buyFeeBps || sellFeeBps) {
                                tokenToResult[address] = { buyFeeBps: buyFeeBps, sellFeeBps: sellFeeBps };
                            }
                        });
                        return [2 /*return*/, tokenToResult];
                }
            });
        });
    };
    return OnChainTokenFeeFetcher;
}());
export { OnChainTokenFeeFetcher };
