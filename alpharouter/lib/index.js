// import { Logger } from '@ethersproject/logger';
// import { flags } from '@oclif/command';
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
import { config } from "dotenv";
import curve from "@curvefi/api";
import express from "express";
var app = express();
var port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
await (function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, curve.init('JsonRpc', { url: 'https://eth-mainnet.g.alchemy.com/v2/ylUVvdvrP5OR_liUKykoj8jI9DyKKkL7' }, { gasPrice: 0, maxFeePerGas: 0, maxPriorityFeePerGas: 0, chainId: 1 })];
            case 1:
                _a.sent();
                // OR
                // await curve.init('JsonRpc', {}, {}); // In this case JsonRpc url, privateKey, fee data and chainId will be specified automatically
                // 2. Infura
                // 3. Web3 provider
                // Fetch factory pools
                return [4 /*yield*/, curve.factory.fetchPools()];
            case 2:
                // OR
                // await curve.init('JsonRpc', {}, {}); // In this case JsonRpc url, privateKey, fee data and chainId will be specified automatically
                // 2. Infura
                // 3. Web3 provider
                // Fetch factory pools
                _a.sent();
                return [4 /*yield*/, curve.crvUSDFactory.fetchPools()];
            case 3:
                _a.sent();
                return [4 /*yield*/, curve.EYWAFactory.fetchPools()];
            case 4:
                _a.sent();
                return [4 /*yield*/, curve.cryptoFactory.fetchPools()];
            case 5:
                _a.sent();
                return [4 /*yield*/, curve.tricryptoFactory.fetchPools()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
app.post("/alpharouter/api", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var protocol, tokenInStr, tokenOutStr, amountStr, recipient, response, _a, q;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                protocol = req.body.protocol || "uniswap";
                tokenInStr = req.body.tokenInStr ||
                    "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b";
                tokenOutStr = req.body.tokenOutStr ||
                    "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419";
                amountStr = req.body.amountStr || "1100";
                recipient = req.body.recipient ||
                    "0x5c2765ff150f3e2a44482A5A28d1Ae82aFd74B11";
                console.log("tokenInStr", tokenInStr);
                console.log("tokenOutStr", tokenOutStr);
                _a = protocol;
                switch (_a) {
                    case "uniswap": return [3 /*break*/, 1];
                    case "curve": return [3 /*break*/, 3];
                }
                return [3 /*break*/, 5];
            case 1:
                q = new Quote();
                return [4 /*yield*/, q.get(tokenInStr, tokenOutStr, amountStr, recipient)];
            case 2:
                response = _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, route, output, path, param;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // 1. Dev
                                console.log("getting route");
                                return [4 /*yield*/, curve.router.getBestRouteAndOutput(tokenInStr, tokenOutStr, amountStr)];
                            case 1:
                                _a = _b.sent(), route = _a.route, output = _a.output;
                                path = [];
                                param = [];
                                path.push(tokenInStr);
                                route.forEach(function (routeStep) {
                                    path.push(routeStep.poolAddress);
                                    path.push(routeStep.outputCoinAddress);
                                    // param.push(routeStep.i)
                                    // param.push(routeStep.j)
                                    // param.push(routeStep.swapType)
                                });
                                response = { path: path, param: param };
                                return [2 /*return*/];
                        }
                    });
                }); })()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.json(response);
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
import { Quote } from "./util/quote.js";
config();
// let logger = Logger.globalLogger();
// Logger.setLogLevel(Logger.levels.DEBUG);
// let logger = bunyan.createLogger({
//     name: 'Default Logger',
//   });
// let logger = bunyan.createLogger({
//   name: "Uniswap Smart Order Router",
//   serializers: bunyan.stdSerializers,
//   level: bunyan.INFO,
//   streams: undefined
//     ? undefined
//     : [
//         {
//           level: bunyan.DEBUG,
//           type: "stream",
//           // stream: bunyanDebugStream({
//           //   basepath: __dirname,
//           //   forceColor: false,
//           //   showDate: false,
//           //   showPid: false,
//           //   showLoggerName: false,
//           //   showLevel: !!true,
//           // }),
//         },
//       ],
// });
// setGlobalLogger(logger);
