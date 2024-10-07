package simulation

import (
	"fmt"
	"math/big"
	"simulated/utils"
	"strconv"
)

func TradeSimulator(protocol, TransactionSimulatorAPI, from, tokenIn, tokenOut, amountIn string, blocknumber int64, customPath ...string) (amountOutput *big.Int, events []map[string]interface{}) {

	switch protocol {

	case "uniswap":
		{
			permit2 := "0x000000000022d473030f116ddee9f6b43ac78ba3"
			universalrouter := "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"

			s := NewSimulation(1, TransactionSimulatorAPI)

			// Approve token to permit 2

			data := utils.Approve(permit2)

			s.AddTx(from, tokenIn, data, "0", blocknumber, 30000000)

			// Approve token to permit 2 to UR

			data = utils.ApprovePermit2(tokenIn, universalrouter)

			s.AddTx(from, permit2, data, "0", blocknumber, 30000000)

			//swap

			// get swap data from uniroutrer endpoint

			// usr := router.NewRouter(router.ProtocolUniswap, RouterAPI)

			// fmt.Println("getting data from uniswap router")

			// res = usr.GetRoutingInfo(tokenIn, tokenOut, amount, from)

			// fmt.Println("got data from uniswap router", res)

			amint, _ := strconv.Atoi(amountIn)

			cdata := utils.UniswaptxExecute(from, tokenIn, tokenOut, int64(amint), customPath...)

			data = cdata
			s.AddTx(from, universalrouter, data, "0", blocknumber, 30000000)
			result := s.SwapEvents()

			events = utils.FilterEvents(protocol, result)

			fmt.Println("--------events", events)

			if len(events) > 0 {
				// lastEvent := events[len(events)-1]
				fmt.Println("out", events[len(events)-1])
				// amountOutput = lastEvent["Amount0Out"]
				fmt.Println(amountOutput)

			}
		}
	case "curve":
		{

			// curverouter := "0x99a58482BD75cbab83b27EC03CA68fF489b5788f"

			// s := simulation.NewSimulation(1, TransactionSimulatorAPI)

			// data := approve(curverouter)

			// s.AddTx(from, tokenIn, data, "0", blocknumber, 30000000)

			// usr := router.NewRouter(router.ProtocolCurveFi, RouterAPI)

			// res = usr.GetRoutingInfo(tokenIn, tokenOut, amount, from)

			// fmt.Println("---", res)

			// data, err = curvetx(res.Param, res.Path, amount)
			// if err != nil {
			// 	log.Println("Error getting data for curve", err)
			// }

			// s.AddTx(from, curverouter, data, "0", blocknumber, 30000000)

			// log.Println("RequestJSON", s.RequestJSON())

			// result := s.SwapEvents()
			// fmt.Println("--------------", result)

			// for _, v := range result {
			// 	fmt.Println("exit reason", v.ExitReason)

			// }
			// events = usr.FilterEvents(result)

		}

	}

	return
}
