package simulation

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type TransactionRequest struct {
	ChainID     int    `json:"chainId"`
	From        string `json:"from"`
	To          string `json:"to"`
	Data        string `json:"data"`
	GasLimit    int    `json:"gasLimit"`
	Value       string `json:"value"`
	BlockNumber int64  `json:"blockNumber"`
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
	request []TransactionRequest
	ChainID int
}

func NewSimulation(ChainID int) *Simulate {

	return &Simulate{ChainID: ChainID}
}

func (s *Simulate) AddTx(from, to, data, value string, blocknumber int64, gaslimit int) {
	tx := TransactionRequest{From: from, To: to, Data: data, Value: value, GasLimit: gaslimit, ChainID: s.ChainID, BlockNumber: blocknumber}
	s.request = append(s.request, tx)
}

func (s *Simulate) RequestJSON() string {
	b, _ := json.Marshal(s.request)
	return string(b[:])
}

func (s *Simulate) SwapEvents() []Result {
	results := s.call()
	return results
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
