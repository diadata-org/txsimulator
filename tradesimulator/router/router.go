package router

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"simulated/simulation"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
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

func (s *Router) GetRoutingInfo(tokenIn, tokenOut, amount, recipient string) RouterResponse {
	req := RouterRequest{Protocol: s.protocol, TokenInStr: tokenIn, TokenOutStr: tokenOut, AmountStr: amount, Recipient: recipient}
	return s.call(req)
}

func (s *Router) FilterEvents(results []simulation.Result) (events []map[string]interface{}) {

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
		for _, l := range results[2].Logs {
			if l.Topics[0] == "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67" {
				swapevent := make(map[string]interface{})
				e := s.abi.UnpackIntoMap(swapevent, "Swap", hexutil.MustDecode(l.Data))
				if e != nil {
					log.Println("UnpackIntoMap Uniswap", e)
				}

				events = append(events, swapevent)

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
