package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"simulated/router"
	"simulated/simulation"

	"github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
	"github.com/ethereum/go-ethereum/common"
)

/*

V2_SWAP_EXACT_IN
address The recipient of the output of the trade
uint256 The amount of input tokens for the trade
uint256 The minimum amount of output tokens the user wants
address[] The UniswapV2 token path to trade along
bool A flag for whether the input tokens should come from the msg.sender (through Permit2) or whether the funds are already in the UniversalRouter

*/

func startSimulatedBackend(simulatedBackend *backends.SimulatedBackend) {
	b, err := simulatedBackend.BalanceAt(context.TODO(), common.HexToAddress("0xCf1e4c0455E69c3A82C2344648bE76C72DBcDa06"), nil)
	if err != nil {
		log.Println("eee", err)
	}
	log.Println(b)

}

var (
	RouterAPI               = "http://localhost:3000/alpharouter/api"
	TransactionSimulatorAPI = "http://localhost:8081/api/v1/simulate-bundle"
)

func main() {

	routerapi := os.Getenv("ROUTER_API")
	txSimulatorAPI := os.Getenv("TRANSACTION_SIMULATOR_API")

	if routerapi != "" {
		RouterAPI = routerapi
	}

	if txSimulatorAPI != "" {
		TransactionSimulatorAPI = txSimulatorAPI
	}

	startServer()
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
	mux.HandleFunc("/tradesimulator/symbol", tradeSimulatorBySymbol)

	// Add custom middleware to log available routes
	mux.HandleFunc("/", logRouteMiddleware)
	log.Printf("Server is running at http://localhost:%s\n", port)

	log.Fatal(http.ListenAndServe(":"+port, mux))
}

func tradeSimulatorBySymbol(w http.ResponseWriter, r *http.Request) {

	symbol := r.URL.Query().Get("symbol")
	blocknumberStr := r.URL.Query().Get("blocknumber")

	symbolConfig := allowedTokens[symbol]

	from := symbolConfig["recipient"]
	amount := symbolConfig["amountStr"]
	tokenOut := symbolConfig["tokenOutStr"]
	tokenIn := symbolConfig["tokenInStr"]

	customPath := []string{}

	pathStr, ok := symbolConfig["path"]
	if ok {
		customPath = strings.Split(pathStr, ",")

	}

	blocknumber, _ := strconv.ParseInt(blocknumberStr, 10, 64)

	protocol := "uniswap"

	if protocol == "" {
		protocol = router.ProtocolUniswap
	}

	fmt.Printf("Recipient: %s, Amount: %s, Token Out: %s, Token In: %s  Protocol: %s\n", from, amount, tokenOut, tokenIn, protocol)

	amountOutput, events := simulation.TradeSimulator(protocol, TransactionSimulatorAPI, from, tokenIn, tokenOut, amount, blocknumber, customPath...)

	w.Header().Set("Content-Type", "application/json")

	response := make(map[string]interface{})
	response["events"] = events
	response["output"] = amountOutput
	response["tokenInStr"] = tokenIn
	response["tokenOutStr"] = tokenOut

	response["blocknumber"] = blocknumberStr

	// response["path"] = res.Path

	json.NewEncoder(w).Encode(response)
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
	pathStr := requestData["path"]

	customPath := strings.Split(pathStr, ",")

	blocknumber, _ := strconv.ParseInt(blocknumberStr, 10, 64)

	protocol := requestData["protocol"]

	if protocol == "" {
		protocol = router.ProtocolUniswap
	}

	fmt.Printf("Recipient: %s, Amount: %s, Token Out: %s, Token In: %s  Protocol: %s\n", from, amount, tokenOut, tokenIn, protocol)

	amountOutput, events := simulation.TradeSimulator(protocol, TransactionSimulatorAPI, from, tokenIn, tokenOut, amount, blocknumber, customPath...)

	w.Header().Set("Content-Type", "application/json")

	response := make(map[string]interface{})
	response["events"] = events
	response["output"] = amountOutput
	response["blocknumber"] = blocknumberStr

	// response["path"] = res.Path

	json.NewEncoder(w).Encode(response)
}
