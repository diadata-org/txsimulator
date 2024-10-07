package utils

import (
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"math/big"
	"simulated/models"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

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

func uniswaptx(fromaddress string, tokenIn, tokenOut string) string {
	const uniswapRouterABI = `[{"constant":false,"inputs":[{"name":"amountIn","type":"uint256"},{"name":"amountOutMin","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"name":"amounts","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]`

	fAddress := common.HexToAddress(fromaddress)

	// Set up the Uniswap router address
	// routerAddress := common.HexToAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")

	// Set up the token addresses for the input and output tokens
	// inputTokenAddress := common.HexToAddress("0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b")
	// outputTokenAddress := common.HexToAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")

	path := []common.Address{common.HexToAddress(tokenIn), common.HexToAddress(tokenOut)}

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

	return hex.EncodeToString(swapData)

}

func transfer(toaddress string) {

	erc20abi, _ := getErc20abi()

	approvedata, err := erc20abi.Pack("transfer", common.HexToAddress(toaddress), big.NewInt(int64(10)).Exp(big.NewInt(10), big.NewInt(18), big.NewInt(0)))
	if err != nil {
		log.Fatal("error approvedata data", err)
	}

	fmt.Printf("transfer: %s\n", hex.EncodeToString(approvedata))

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
func Approve(spender string) string {

	erc20abi, _ := getErc20abi()
	tenEighteen := big.NewInt(10)
	bigNumber := big.NewInt(1100000)
	approvedata, err := erc20abi.Pack("approve", common.HexToAddress(spender), bigNumber.Mul(bigNumber, new(big.Int).Exp(tenEighteen, big.NewInt(18), nil)))
	if err != nil {
		log.Fatal("error approvedata data", err)
	}

	return hex.EncodeToString(approvedata)

}

func ApprovePermit2(token, spender string) string {
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

func FilterEvents(protocol string, results []models.Result) (events []map[string]interface{}) {

	switch protocol {
	// case router.ProtocolCurveFi:

	// for _, l := range results[1].Logs {
	// 	if l.Topics[0] == "0x14b561178ae0f368f40fafd0485c4f7129ea71cdc00b4ce1e5940f9bc659c8b2" {

	// 		swapevent := make(map[string]interface{})
	// 		e := s.abi.UnpackIntoMap(swapevent, "ExchangeMultiple", hexutil.MustDecode(l.Data))
	// 		if e != nil {
	// 			log.Println("UnpackIntoMap Curve", e)
	// 		}

	// 		events = append(events, swapevent)

	// 	}
	// }

	case "uniswap":
		fmt.Println("--------------------------")

		fmt.Println("--------results-----------")

		for i, v := range results {

			fmt.Println("-------result-------------------", i)
			// fmt.Println("-------v-------------------", v)

			for _, l := range v.Logs {

				fmt.Println("-------log-------------------", l.Topics)
				fmt.Println("-------data-------------------", l.Data)

			}

		}
		fmt.Println("--------------------------")
		if len(results) >= 3 {
			for _, l := range results[2].Logs {
				fmt.Println("-----.Topics", l.Topics)

				if l.Topics[0] == "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822" {
					swapevent := make(map[string]interface{})

					// e := s.abi.UnpackIntoInterface(&ev, "Swap", hexutil.MustDecode(l.Data))
					// if e != nil {
					// 	log.Println("UnpackIntoMap Uniswap", e)
					// }

					// fmt.Println("ev", ev)

					data := hexutil.MustDecode(l.Data)

					in0 := new(big.Int).SetBytes(data[:32])
					in1 := new(big.Int).SetBytes(data[32:64])
					out0 := new(big.Int).SetBytes(data[64:96])
					out1 := new(big.Int).SetBytes(data[96:])

					fmt.Println("in0", in0.Int64())
					fmt.Println("in1", in1.Int64())
					fmt.Println("out0", out0.Int64())
					fmt.Println("out1", out1.Int64())

					swapevent["Amount0In"] = in0.Int64()
					swapevent["Amount0Out"] = out0.Int64()
					swapevent["Amount1In"] = in1.Int64()
					swapevent["Amount1Out"] = out1.Int64()

					events = append(events, swapevent)

				}
			}
		}
	}

	return
}

var (
	addressType, _ = abi.NewType("address", "address", nil)
	uint256Type, _ = abi.NewType("uint256", "uint256", nil)
	pathTypeV2, _  = abi.NewType("address[]", "address[]", nil)
	boolType, _    = abi.NewType("bool", "bool", nil)

	pathTypeV3, _ = abi.NewType("bytes", "bytes", nil)

	v2SwapExactIN = abi.Arguments{
		abi.Argument{Name: "recipient", Type: addressType},
		abi.Argument{Name: "amountIn", Type: uint256Type},
		abi.Argument{Name: "amountOutMinimum", Type: uint256Type},
		abi.Argument{Name: "path", Type: pathTypeV2},
		abi.Argument{Name: "is", Type: boolType},
	}

	v3SwapExactIN = abi.Arguments{
		abi.Argument{Name: "recipient", Type: addressType},
		abi.Argument{Name: "amountIn", Type: uint256Type},
		abi.Argument{Name: "amountOutMinimum", Type: uint256Type},
		abi.Argument{Name: "path", Type: pathTypeV3},
		abi.Argument{Name: "is", Type: boolType},
	}
)

func UniswaptxExecute(fromaddress string, tokenIn, tokenOut string, amount int64, customPath ...string) string {
	const uniswapRouterABI = `[ {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "commands",
                "type": "bytes"
            },
            {
                "internalType": "bytes[]",
                "name": "inputs",
                "type": "bytes[]"
            },
			{"internalType":"uint256","name":"deadline","type":"uint256"}
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }]`

	fAddress := common.HexToAddress(fromaddress)

	// Set up the Uniswap router address
	// routerAddress := common.HexToAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")

	// Set up the token addresses for the input and output tokens
	// inputTokenAddress := common.HexToAddress("0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b")
	// outputTokenAddress := common.HexToAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
	path := []common.Address{}

	if len(customPath) > 1 {
		for _, address := range customPath {
			path = append(path, common.HexToAddress(address))
		}

	} else {
		path = []common.Address{common.HexToAddress(tokenIn), common.HexToAddress(tokenOut)}
	}

	// Set up the amount of input token and minimum output token desired
	amountIn := big.NewInt(amount) // 1 ETH in wei
	amountOutMin := big.NewInt(0)

	// Set up the deadline for the transaction
	// t := time.Now()
	// deadLine := t.Add(time.Hour * 24).Unix()
	routerABI, err := abi.JSON(strings.NewReader(uniswapRouterABI))
	if err != nil {
		log.Fatal(err)
	}

	var commandInputs []byte
	var pathv3 Paths
	version := "08" // 08 for v2 00 for v3

	switch version {
	case "08":
		{

			fmt.Println("path", path)
			commandInputs, err = v2SwapExactIN.Pack(
				fAddress,
				amountIn,
				amountOutMin,
				path,
				true,
			)
			if err != nil {
				log.Fatal("error commandInputs data", err)
			}

		}
	case "00":
		{

			pathencoded, _ := EncodeV3Path([]common.Address{common.HexToAddress(tokenIn), common.HexToAddress(tokenOut)}, []string{})
			fmt.Println("pathencoded", pathencoded)
			pathv3.AddPath(common.HexToAddress(tokenIn), common.HexToAddress(tokenOut))

			commandInputs, err = v3SwapExactIN.Pack(
				fAddress,
				amountIn,
				amountOutMin,
				pathv3.ToBytes(0),
				true,
			)
			if err != nil {
				log.Fatal("error commandInputs data", err)
			}

		}
	}

	// Generate the swap path for the tokens
	// path := []common.Address{inputTokenAddress, outputTokenAddress}
	// Generate the encoded swap function call data

	// t := time.Now().Unix() + 6000
	swapData, err := routerABI.Pack("execute",
		common.Hex2Bytes(version),
		[][]byte{commandInputs},
		big.NewInt(1821852558),
	)

	if err != nil {
		log.Fatal("error getting data", err)
	}
	fmt.Printf("Data: %s\n", hex.EncodeToString(swapData))

	return hex.EncodeToString(swapData)

}

func EncodeV3Path(paths []common.Address, fees []string) (string, error) {
	var pathString string
	if len(paths) == 0 {
		return pathString, errors.New("path length = 0")
	}

	str := ""
	for i := 0; i < len(paths); i++ {
		str += RemovePrefix0x(paths[i].Hex())
		if i < len(fees) {
			str += RemovePrefix0x(fees[i])
		}
	}

	pathString, err := HexToBase64(str)
	if err != nil {
		return pathString, err
	}
	return pathString, nil
}

func RemovePrefix0x(s string) string {
	return strings.TrimPrefix(s, "0x")
}

func HexToBase64(s string) (string, error) {
	decodedData, err := hex.DecodeString(s)
	if err == nil {
		base64Data := base64.StdEncoding.EncodeToString(decodedData)
		return base64Data, nil
	}
	return "", err
}
