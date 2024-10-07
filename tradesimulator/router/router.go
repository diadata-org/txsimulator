package router

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"simulated/models"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

type RouterResponse struct {
	Recipient string   `json:"recipient"`
	To        string   `json:"to"`
	Path      []string `json:"path"`
	Data      string   `json:"data"`
	Param     []int    `json:"param"`
}

const (
	ProtocolCurveFi = "curve"
	ProtocolUniswap = "uniswap"
)

type RouterRequest struct {
	TokenInStr  string `json:"tokenInStr"`
	TokenOutStr string `json:"tokenOutStr"`
	AmountStr   string `json:"amountStr"`
	Recipient   string `json:"recipient"`
	Protocol    string `json:"protocol"`
}

type Router struct {
	abi       abi.ABI
	protocol  string
	routerAPI string
}

func NewRouter(protocol, routerAPI string) *Router {
	var tempAbi abi.ABI
	switch protocol {
	case ProtocolCurveFi:
		tempAbi, _ = abi.JSON(strings.NewReader(curveabi))
	case ProtocolUniswap:
		tempAbi, _ = abi.JSON(strings.NewReader(uniswapv3poolabi))
	}
	return &Router{protocol: protocol, abi: tempAbi, routerAPI: routerAPI}
}

type SwapEvent struct {
	Contract   common.Address
	Sender     common.Address
	To         common.Address
	Amount0In  *big.Int
	Amount1In  *big.Int
	Amount0Out *big.Int
	Amount1Out *big.Int
}

func (s *Router) GetRoutingInfo(tokenIn, tokenOut, amount, recipient string) RouterResponse {
	req := RouterRequest{Protocol: s.protocol, TokenInStr: tokenIn, TokenOutStr: tokenOut, AmountStr: amount, Recipient: recipient}
	return s.call(req)
}

func (s *Router) FilterEvents(results []models.Result) (events []map[string]interface{}) {

	switch s.protocol {
	case ProtocolCurveFi:

		for _, l := range results[1].Logs {
			if l.Topics[0] == "0x14b561178ae0f368f40fafd0485c4f7129ea71cdc00b4ce1e5940f9bc659c8b2" {

				swapevent := make(map[string]interface{})
				e := s.abi.UnpackIntoMap(swapevent, "ExchangeMultiple", hexutil.MustDecode(l.Data))
				if e != nil {
					log.Println("UnpackIntoMap Curve", e)
				}

				events = append(events, swapevent)

			}
		}

	case ProtocolUniswap:

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

					swapevent["amount0"] = out0

					events = append(events, swapevent)

				}
			}
		}
	}

	return
}

func (s *Router) call(request RouterRequest) (urr RouterResponse) {

	method := "POST"
	client := &http.Client{}
	b, _ := json.Marshal(request)
	req, err := http.NewRequest(method, s.routerAPI, bytes.NewReader(b))

	if err != nil {
		return
	}
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return
	}

	json.Unmarshal(body, &urr)
	return
}
