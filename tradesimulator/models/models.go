package models

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
	ExitReason InstructionResult `json:"exitReason"`
	ReturnData string            `json:"returnData"`
}

type InstructionResult int

const (
	// success codes
	Continue InstructionResult = iota
	Stop
	Return
	SelfDestruct

	// revert codes
	Revert // revert opcode
	CallTooDeep
	OutOfFund

	// error codes
	OutOfGas
	OpcodeNotFound
	CallNotAllowedInsideStatic
	InvalidOpcode
	InvalidJump
	InvalidMemoryRange
	NotActivated
	StackUnderflow
	StackOverflow
	OutOfOffset
	FatalExternalError
	GasMaxFeeGreaterThanPriorityFee
	PrevrandaoNotSet
	GasPriceLessThenBasefee
	CallerGasLimitMoreThenBlock
	RejectCallerWithCode
	LackOfFundForGasLimit
	CreateCollision
	OverflowPayment
	PrecompileError
	NonceOverflow
	CreateContractLimit
	CreateContractWithEF
)
