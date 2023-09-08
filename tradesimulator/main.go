package main

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"simulated/router"
	"simulated/simulation"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
	"github.com/ethereum/go-ethereum/common"
)

func startSimulatedBackend(simulatedBackend *backends.SimulatedBackend) {
	b, err := simulatedBackend.BalanceAt(context.TODO(), common.HexToAddress("0xCf1e4c0455E69c3A82C2344648bE76C72DBcDa06"), nil)
	if err != nil {
		log.Println("eee", err)
	}
	log.Println(b)

}

const RouterAPI = "http://localhost:3000/alpharouter/api"

func main() {

	startServer()
}

/*

1) Approve
2) Fill wallet


*/

func curvetx(param []int, path []string, amount string) (string, error) {
	const curveRouterABI = `[{
		"stateMutability": "payable",
		"type": "function",
		"name": "exchange_multiple",
		"inputs": [{
			"name": "_route",
			"type": "address[9]"
		}, {
			"name": "_swap_params",
			"type": "uint256[3][4]"
		}, {
			"name": "_amount",
			"type": "uint256"
		}, {
			"name": "_expected",
			"type": "uint256"
		}, {
			"name": "_pools",
			"type": "address[4]"
		}],
		"outputs": [{
			"name": "",
			"type": "uint256"
		}]
	}]`

	var (
		route      [9]common.Address
		curvePath  [4]common.Address
		swapParams [4][3]*big.Int
	)

	for len(param) < 12 {
		param = append(param, 0)
	}

	index := 0
	for i := 0; i < 4; i++ {
		for j := 0; j < 3; j++ {
			swapParams[i][j] = big.NewInt(int64(param[index]))
			index++
		}
	}

	for index, address := range path {
		route[index] = common.HexToAddress(address)
	}

	routerABI, err := abi.JSON(strings.NewReader(curveRouterABI))
	if err != nil {
		return "", err
	}
	amountin, _ := new(big.Int).SetString(amount, 10)

	expected, _ := new(big.Int).SetString("0", 10)

	swapData, err := routerABI.Pack("exchange_multiple", route, swapParams, amountin, expected, curvePath)

	return hex.EncodeToString(swapData), err

}

func uniswaptx(fromaddress string, client *backends.SimulatedBackend) {
	const uniswapRouterABI = `[{"constant":false,"inputs":[{"name":"amountIn","type":"uint256"},{"name":"amountOutMin","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"name":"amounts","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]`

	fAddress := common.HexToAddress(fromaddress)

	// Set up the Uniswap router address
	// routerAddress := common.HexToAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")

	// Set up the token addresses for the input and output tokens
	// inputTokenAddress := common.HexToAddress("0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b")
	// outputTokenAddress := common.HexToAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")

	path := []common.Address{common.HexToAddress("0x2E4784446A0a06dF3D1A040b03e1680Ee266c35a"), common.HexToAddress("0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"), common.HexToAddress("0xA14aFC841a2742Cbd52587b705F00f322309580e")}

	// Set up the amount of input token and minimum output token desired
	amountIn := big.NewInt(10) // 1 ETH in wei
	amountOutMin := big.NewInt(0)

	// Set up the deadline for the transaction
	t := time.Now()
	deadLine := t.Add(time.Hour * 24).Unix()
	routerABI, err := abi.JSON(strings.NewReader(uniswapRouterABI))
	if err != nil {
		log.Fatal(err)
	}

	// Generate the swap path for the tokens
	// path := []common.Address{inputTokenAddress, outputTokenAddress}

	// Generate the encoded swap function call data
	swapData, err := routerABI.Pack("swapExactTokensForTokens", amountIn, amountOutMin, path, fAddress, big.NewInt(deadLine))
	if err != nil {
		log.Fatal("error getting data", err)
	}
	fmt.Printf("Data: %s\n", hex.EncodeToString(swapData))

}

func getErc20abi() (abi.ABI, error) {

	const erc20 = `[{
		"constant": false,
		"inputs": [{
			"internalType": "address",
			"name": "spender",
			"type": "address"
		}, {
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		}],
		"name": "approve",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},{
		"constant": false,
		"inputs": [{
			"internalType": "address",
			"name": "recipient",
			"type": "address"
		}, {
			"internalType": "uint256",
			"name": "amount",
			"type": "uint256"
		}],
		"name": "transfer",
		"outputs": [{
			"internalType": "bool",
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}]`

	return abi.JSON(strings.NewReader(erc20))

}

func approve(spender string) string {

	erc20abi, _ := getErc20abi()
	tenEighteen := big.NewInt(10)
	bigNumber := big.NewInt(1100000)
	approvedata, err := erc20abi.Pack("approve", common.HexToAddress(spender), bigNumber.Mul(bigNumber, new(big.Int).Exp(tenEighteen, big.NewInt(18), nil)))
	if err != nil {
		log.Fatal("error approvedata data", err)
	}

	return hex.EncodeToString(approvedata)

}

func approvepermit2(token, spender string) string {
	abipermit := `[{
	"inputs": [{
		"internalType": "address",
		"name": "token",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {
		"internalType": "uint160",
		"name": "amount",
		"type": "uint160"
	}, {
		"internalType": "uint48",
		"name": "expiration",
		"type": "uint48"
	}],
	"name": "approve",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}]`

	permitabi, _ := abi.JSON(strings.NewReader(abipermit))

	tenEighteen := big.NewInt(10)
	bigNumber := big.NewInt(1100000)

	approvedata, err := permitabi.Pack("approve", common.HexToAddress(token), common.HexToAddress(spender), bigNumber.Mul(bigNumber, new(big.Int).Exp(tenEighteen, big.NewInt(18), nil)), big.NewInt(2090391974))
	if err != nil {
		log.Println("error approvedata data", err)
	}

	return hex.EncodeToString(approvedata)

}

func transfer(toaddress string) {

	erc20abi, _ := getErc20abi()

	approvedata, err := erc20abi.Pack("transfer", common.HexToAddress(toaddress), big.NewInt(int64(10)).Exp(big.NewInt(10), big.NewInt(18), big.NewInt(0)))
	if err != nil {
		log.Fatal("error approvedata data", err)
	}

	fmt.Printf("transfer: %s\n", hex.EncodeToString(approvedata))

}

func logRouteMiddleware(w http.ResponseWriter, r *http.Request) {
	log.Printf("Request received for route: %s\n", r.URL.Path)
	http.DefaultServeMux.ServeHTTP(w, r)
}

func startServer() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8085"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/tradesimulator/tradeSimulator", tradeSimulator)

	// Add custom middleware to log available routes
	mux.HandleFunc("/", logRouteMiddleware)
	log.Printf("Server is running at http://localhost:%s\n", port)

	log.Fatal(http.ListenAndServe(":"+port, mux))
}

func tradeSimulator(w http.ResponseWriter, r *http.Request) {

	log.Println("tradeSimulator", "tradeSimulator")

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var requestData map[string]string
	err := json.NewDecoder(r.Body).Decode(&requestData)
	if err != nil {
		http.Error(w, "Invalid JSON data", http.StatusBadRequest)
		return
	}

	requiredVariables := []string{"recipient", "amountStr", "tokenOutStr", "tokenInStr"}
	for _, key := range requiredVariables {
		if requestData[key] == "" {
			http.Error(w, fmt.Sprintf("Missing required POST variable: %s", key), http.StatusBadRequest)
			return
		}
	}

	from := requestData["recipient"]
	amount := requestData["amountStr"]
	tokenOut := requestData["tokenOutStr"]
	tokenIn := requestData["tokenInStr"]
	blocknumberStr := requestData["blocknumber"]

	blocknumber, _ := strconv.ParseInt(blocknumberStr, 10, 64)

	protocol := requestData["protocol"]

	if protocol == "" {
		protocol = router.ProtocolUniswap
	}

	fmt.Printf("Recipient: %s, Amount: %s, Token Out: %s, Token In: %s  Protocol: %s\n", from, amount, tokenOut, tokenIn, protocol)

	// from := "0x000000000000000000000000000000000000dead"
	// tokenIn := "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	// tokenOut := "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419"
	// amount := "10"

	var (
		events []map[string]interface{}
		res    router.RouterResponse
	)
	amountOutput := big.NewInt(0)

	switch protocol {

	case router.ProtocolUniswap:
		{
			permit2 := "0x000000000022d473030f116ddee9f6b43ac78ba3"
			universalrouter := "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"

			s := simulation.NewSimulation(1)

			// Approve token to permit 2

			data := approve(permit2)

			s.AddTx(from, tokenIn, data, "0", blocknumber, 30000000)

			// Approve token to permit 2 to UR

			data = approvepermit2(tokenIn, universalrouter)

			s.AddTx(from, permit2, data, "0", blocknumber, 30000000)

			//swap

			// get swap data from uniroutrer endpoint

			usr := router.NewRouter(router.ProtocolUniswap, RouterAPI)

			fmt.Println("getting data from uniswap router")

			res = usr.GetRoutingInfo(tokenIn, tokenOut, amount, from)

			data = res.Data
			s.AddTx(from, universalrouter, data, "0", blocknumber, 30000000)
			result := s.SwapEvents()

			events = usr.FilterEvents(result)

			if len(events) > 0 {
				lastEvent := events[len(events)-1]
				fmt.Println("out", events[len(events)-1])
				amountOutput = lastEvent["amount0"].(*big.Int).Abs(lastEvent["amount0"].(*big.Int))
				fmt.Println(amountOutput)
			}
		}
	case router.ProtocolCurveFi:
		{

			curverouter := "0x99a58482BD75cbab83b27EC03CA68fF489b5788f"

			s := simulation.NewSimulation(1)

			data := approve(curverouter)

			s.AddTx(from, tokenIn, data, "0", blocknumber, 30000000)

			usr := router.NewRouter(router.ProtocolCurveFi, RouterAPI)

			res = usr.GetRoutingInfo(tokenIn, tokenOut, amount, from)

			data, err = curvetx(res.Param, res.Path, amount)
			if err != nil {
				log.Println("Error getting data for curve", err)
			}

			s.AddTx(from, curverouter, data, "0", blocknumber, 30000000)

			log.Println(s.RequestJSON())

			result := s.SwapEvents()
			events = usr.FilterEvents(result)

		}

	}

	w.Header().Set("Content-Type", "application/json")

	response := make(map[string]interface{})
	response["events"] = events
	response["output"] = amountOutput
	response["path"] = res.Path

	json.NewEncoder(w).Encode(response)
}
