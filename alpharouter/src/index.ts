// import { Logger } from '@ethersproject/logger';
// import { flags } from '@oclif/command';

import { config } from "dotenv";
import _ from "lodash";
import  curve  from "@curvefi/api";

// import { UniswapQuote } from "./util/UniswapQuote.js";

import * as Config from '@oclif/config';


import { setGlobalLogger } from "@uniswap/smart-order-router";
import express, { Request, Response } from "express";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


await(async()=>{
  await curve.init('JsonRpc', {url: 'https://eth-mainnet.g.alchemy.com/v2/ylUVvdvrP5OR_liUKykoj8jI9DyKKkL7'}, { gasPrice: 0, maxFeePerGas: 0, maxPriorityFeePerGas: 0, chainId: 1 });
// OR
// await curve.init('JsonRpc', {}, {}); // In this case JsonRpc url, privateKey, fee data and chainId will be specified automatically

// 2. Infura
 
// 3. Web3 provider
  // Fetch factory pools
await curve.factory.fetchPools();
await curve.crvUSDFactory.fetchPools();
await curve.EYWAFactory.fetchPools();
await curve.cryptoFactory.fetchPools();
await curve.tricryptoFactory.fetchPools();
})()

app.post("/alpharouter/api", async (req: Request, res: Response) => {
  const protocol = (req.body.protocol as string) || ("uniswap" as string); // Default to 'Anonymous' if 'name' parameter is not provided

  const tokenInStr =
    (req.body.tokenInStr as string) ||
    ("0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" as string); // Default to 'Anonymous' if 'name' parameter is not provided
  const tokenOutStr =
    (req.body.tokenOutStr as string) ||
    "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419"; // Default to 'Anonymous' if 'name' parameter is not provided
  const amountStr = (req.body.amountStr as string) || "1100"; // Default to 'Anonymous' if 'name' parameter is not provided
  const recipient =
    (req.body.recipient as string) ||
    "0x5c2765ff150f3e2a44482A5A28d1Ae82aFd74B11"; // Default to 'Anonymous' if 'name' parameter is not provided

  console.log("tokenInStr", tokenInStr);
  console.log("tokenOutStr", tokenOutStr);
  let response;

  switch (protocol) {
    case "uniswap":
      {
        let q = new Quote();
        response = await q.get(tokenInStr, tokenOutStr, amountStr, recipient);
      }

      break;
    case "curve": {
     
    
await (async () => {
  // 1. Dev


  console.log("getting route");


  const { route, output } = await  curve.router.getBestRouteAndOutput(tokenInStr, tokenOutStr, amountStr);



  let path:String[]= []
  let param:number[]= []

  path.push(tokenInStr)
  route.forEach(routeStep => {
    path.push(routeStep.poolAddress)
    path.push(routeStep.outputCoinAddress)
    // param.push(routeStep.i)
    // param.push(routeStep.j)
    // param.push(routeStep.swapType)

  });

  response = {path:path,param:param};



})()


    }
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import bunyan from "bunyan";
import bunyanDebugStream from "bunyan-debug-stream";
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
