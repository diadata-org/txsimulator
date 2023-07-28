"use strict";
// import { Logger } from '@ethersproject/logger';
// import { flags } from '@oclif/command';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const quote_1 = require("./util/quote");
const smart_order_router_1 = require("@uniswap/smart-order-router");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Define a sample route
app.post("/api", async (req, res) => {
    let q = new quote_1.Quote();
    const tokenInStr = req.body.tokenInStr || '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b'; // Default to 'Anonymous' if 'name' parameter is not provided
    const tokenOutStr = req.body.tokenOutStr || '0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419'; // Default to 'Anonymous' if 'name' parameter is not provided
    const amountStr = req.body.amountStr || '1100'; // Default to 'Anonymous' if 'name' parameter is not provided
    const recipient = req.body.recipient || '0x5c2765ff150f3e2a44482A5A28d1Ae82aFd74B11'; // Default to 'Anonymous' if 'name' parameter is not provided
    console.log("tokenInStr", tokenInStr);
    console.log("tokenOutStr", req.body.tokenInStr);
    let response = await q.get(tokenInStr, tokenOutStr, amountStr, recipient);
    res.json(response);
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
const bunyan_1 = __importDefault(require("bunyan"));
const bunyan_debug_stream_1 = __importDefault(require("bunyan-debug-stream"));
(0, dotenv_1.config)();
// let logger = Logger.globalLogger();
// Logger.setLogLevel(Logger.levels.DEBUG);
// let logger = bunyan.createLogger({
//     name: 'Default Logger',
//   });
let logger = bunyan_1.default.createLogger({
    name: "Uniswap Smart Order Router",
    serializers: bunyan_1.default.stdSerializers,
    level: bunyan_1.default.INFO,
    streams: undefined
        ? undefined
        : [
            {
                level: bunyan_1.default.DEBUG,
                type: "stream",
                stream: (0, bunyan_debug_stream_1.default)({
                    basepath: __dirname,
                    forceColor: false,
                    showDate: false,
                    showPid: false,
                    showLoggerName: false,
                    showLevel: !!true,
                }),
            },
        ],
});
(0, smart_order_router_1.setGlobalLogger)(logger);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtEQUFrRDtBQUNsRCwwQ0FBMEM7Ozs7O0FBRTFDLG1DQUFnQztBQUVoQyx3Q0FBa0M7QUFFbEMsb0VBQThEO0FBQzlELHNEQUFxRDtBQUVyRCxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFFbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7QUFHNUUsd0JBQXdCO0FBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDckQsSUFBSSxDQUFDLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztJQUNwQixNQUFNLFVBQVUsR0FBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQW9CLElBQUksNENBQXNELENBQUMsQ0FBQyw2REFBNkQ7SUFDeEssTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFzQixJQUFJLDRDQUE0QyxDQUFDLENBQUMsNkRBQTZEO0lBQ2xLLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBb0IsSUFBSSxNQUFNLENBQUMsQ0FBQyw2REFBNkQ7SUFDeEgsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFtQixJQUFLLDRDQUE0QyxDQUFDLENBQUMsNkRBQTZEO0lBRTlKLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFOUMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBQyxXQUFXLEVBQUMsU0FBUyxFQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXZFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDLENBQUMsQ0FBQztBQUVILG9EQUE0QjtBQUM1Qiw4RUFBb0Q7QUFFcEQsSUFBQSxlQUFNLEdBQUUsQ0FBQztBQUVULHNDQUFzQztBQUN0QywyQ0FBMkM7QUFFM0MscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUM5QixRQUFRO0FBRVIsSUFBSSxNQUFNLEdBQUcsZ0JBQU0sQ0FBQyxZQUFZLENBQUM7SUFDL0IsSUFBSSxFQUFFLDRCQUE0QjtJQUNsQyxXQUFXLEVBQUUsZ0JBQU0sQ0FBQyxjQUFjO0lBQ2xDLEtBQUssRUFBRSxnQkFBTSxDQUFDLElBQUk7SUFDbEIsT0FBTyxFQUFFLFNBQVM7UUFDaEIsQ0FBQyxDQUFDLFNBQVM7UUFDWCxDQUFDLENBQUM7WUFDRTtnQkFDRSxLQUFLLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO2dCQUNuQixJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsSUFBQSw2QkFBaUIsRUFBQztvQkFDeEIsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFVBQVUsRUFBRSxLQUFLO29CQUNqQixRQUFRLEVBQUUsS0FBSztvQkFDZixPQUFPLEVBQUUsS0FBSztvQkFDZCxjQUFjLEVBQUUsS0FBSztvQkFDckIsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJO2lCQUNsQixDQUFDO2FBQ0g7U0FDRjtDQUNOLENBQUMsQ0FBQztBQUVILElBQUEsb0NBQWUsRUFBQyxNQUFNLENBQUMsQ0FBQyJ9