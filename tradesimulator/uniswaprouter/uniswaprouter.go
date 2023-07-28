package uniswaprouter

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type UniRouterResponse struct {
	Recipient string   `json:"recipient"`
	To        string   `json:"to"`
	Path      []string `json:"path"`
	Data      string   `json:"data"`
}

type UniRouterRequest struct {
	TokenInStr  string `json:"tokenInStr"`
	TokenOutStr string `json:"tokenOutStr"`
	AmountStr   string `json:"amountStr"`
	Recipient   string `json:"recipient"`
}

type UNIRouter struct {
}

func NewUniSwapRouter() *UNIRouter {
	return &UNIRouter{}
}

func (s *UNIRouter) GetRoutingInfo(tokenIn, tokenOut, amount, recipient string) UniRouterResponse {
	req := UniRouterRequest{TokenInStr: tokenIn, TokenOutStr: tokenOut, AmountStr: amount, Recipient: recipient}
	return s.call(req)
}

func (s *UNIRouter) call(request UniRouterRequest) (urr UniRouterResponse) {
	url := "http://localhost:3000/api"
	method := "POST"
	client := &http.Client{}
	b, _ := json.Marshal(request)
	req, err := http.NewRequest(method, url, bytes.NewReader(b))

	if err != nil {
		fmt.Println(err)
		return
	}
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	json.Unmarshal(body, &urr)
	return
}
