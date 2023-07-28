package simulation

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

type TransactionRequest struct {
	ChainID     int    `json:"chainId"`
	From        string `json:"from"`
	To          string `json:"to"`
	Data        string `json:"data"`
	GasLimit    int    `json:"gasLimit"`
	Value       string `json:"value"`
	BlockNumber int    `json:"blockNumber"`
	FormatTrace bool   `json:"formatTrace"`
}

type Result struct {
	SimulationID int  `json:"simulationId"`
	GasUsed      int  `json:"gasUsed"`
	BlockNumber  int  `json:"blockNumber"`
	Success      bool `json:"success"`
	Trace        []struct {
		CallType string `json:"callType"`
		From     string `json:"from"`
		To       string `json:"to"`
		Value    string `json:"value"`
	} `json:"trace"`
	FormattedTrace any `json:"formattedTrace"`
	Logs           []struct {
		Address string   `json:"address"`
		Topics  []string `json:"topics"`
		Data    string   `json:"data"`
	} `json:"logs"`
	ExitReason string `json:"exitReason"`
	ReturnData string `json:"returnData"`
}

type Simulate struct {
	request          []TransactionRequest
	ChainID          int
	uniswapV3PoolABI abi.ABI
}

func NewSimulation(ChainID int) *Simulate {
	uniswapV3PoolABI, _ := abi.JSON(strings.NewReader(uniswapv3poolabi))
	return &Simulate{ChainID: ChainID, uniswapV3PoolABI: uniswapV3PoolABI}
}

func (s *Simulate) AddTx(from, to, data, value string, gaslimit int) {
	tx := TransactionRequest{From: from, To: to, Data: data, Value: value, GasLimit: gaslimit, ChainID: s.ChainID, BlockNumber: 17778361}
	s.request = append(s.request, tx)
}

func (s *Simulate) RequestJSON() string {
	b, _ := json.Marshal(s.request)
	return string(b[:])
}

func (s *Simulate) SwapEvents() (events []map[string]interface{}) {
	results := s.call()

	for _, l := range results[2].Logs {
		if l.Topics[0] == "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67" {
			fmt.Println("Event Address:", l.Address)
			fmt.Println("Event Topics:", l.Topics)
			fmt.Println("Event Data:", l.Data)

			swapevent := make(map[string]interface{})
			e := s.uniswapV3PoolABI.UnpackIntoMap(swapevent, "Swap", hexutil.MustDecode(l.Data))
			if e != nil {
				log.Println("swapevent err", e)
			}

			events = append(events, swapevent)

		}
	}
	return
}

func (s *Simulate) call() (r []Result) {
	url := "http://localhost:8080/api/v1/simulate-bundle"
	method := "POST"
	client := &http.Client{}
	b, _ := json.Marshal(s.request)
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

	json.Unmarshal(body, &r)
	return
}
