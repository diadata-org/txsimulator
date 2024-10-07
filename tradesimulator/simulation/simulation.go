package simulation

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"simulated/models"
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

type Simulate struct {
	request []TransactionRequest
	ChainID int
	URL     string
}

func NewSimulation(ChainID int, URL string) *Simulate {

	return &Simulate{ChainID: ChainID, URL: URL}
}

func (s *Simulate) AddTx(from, to, data, value string, blocknumber int64, gaslimit int) {
	tx := TransactionRequest{From: from, To: to, Data: data, Value: value, GasLimit: gaslimit, ChainID: s.ChainID, BlockNumber: blocknumber, FormatTrace: true}
	s.request = append(s.request, tx)
}

func (s *Simulate) RequestJSON() string {
	b, _ := json.Marshal(s.request)
	return string(b[:])
}

func (s *Simulate) SwapEvents() []models.Result {
	results := s.call()
	return results
}

func (s *Simulate) call() (r []models.Result) {
	method := "POST"
	client := &http.Client{}
	b, _ := json.Marshal(s.request)

	fmt.Println("string(b[:])", string(b[:]))
	req, err := http.NewRequest(method, s.URL, bytes.NewReader(b))
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

	body, err := io.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		return
	}

	json.Unmarshal(body, &r)
	fmt.Println("----cal", r)

	return
}
