package utils

import (
	"bytes"
	"fmt"

	"github.com/ethereum/go-ethereum/common"
)

const (
	V3_SWAP_EXACT_IN = iota
	V3_SWAP_EXACT_OUT
	PERMIT2_TRANSFER_FROM
	PERMIT2_PERMIT_BATCH
	SWEEP
	TRANSFER
	PAY_PORTION
	_
	V2_SWAP_EXACT_IN
	V2_SWAP_EXACT_OUT
	PERMIT2_PERMIT
	WRAP_ETH
	UNWRAP_WETH
	PERMIT2_TRANSFER_FROM_BATCH
	_
	_
	SEAPORT_V1_5
	LOOKS_RARE_721
	NFTX
	CRYPTOPUNKS
	LOOKS_RARE_1155
	OWNER_CHECK_721
	OWNER_CHECK_1155
	SWEEP_ERC721
	X2Y2_721
	SUDOSWAP
	NFT20
	X2Y2_1155
	FOUNDATION
	SWEEP_ERC1155

	MASK = 0x3F
)

type Paths struct {
	up []UniswapPath
}

type UniswapPath struct {
	TokenIn  common.Address
	Fee      int64
	TokenOut common.Address
}

func (p *Paths) AddPath(in common.Address, out common.Address) {
	p.up = append(p.up, UniswapPath{TokenIn: in, TokenOut: out})

}

func (p Paths) ToV2() []common.Address {
	var result []common.Address
	for index, path := range p.up {
		result = append(result, path.TokenIn)
		if index == len(p.up)-1 { // last need to append tokenOut
			result = append(result, path.TokenOut)
			continue
		}
	}
	return result
}

func (p Paths) ToBytes(fnName byte) []byte {

	fmt.Println("UniswapPath", p)
	var result = bytes.NewBuffer(nil)
	switch fnName {
	case V3_SWAP_EXACT_OUT, V3_SWAP_EXACT_IN:
		for index, item := range p.up {
			tokenIn := item.TokenIn.Hex()
			tokenOut := item.TokenOut.Hex()
			fee := fmt.Sprintf("%06x", item.Fee)
			if fnName == V3_SWAP_EXACT_OUT {
				tokenIn = p.up[len(p.up)-index-1].TokenOut.Hex()
				tokenOut = p.up[len(p.up)-index-1].TokenIn.Hex()
				fee = fmt.Sprintf("%06x", p.up[len(p.up)-index-1].Fee)
			}
			result.Write(common.Hex2Bytes(tokenIn[2:]))
			result.Write(common.Hex2Bytes(fee))
			if index == len(p.up)-1 {
				result.Write(common.Hex2Bytes(tokenOut[2:]))
				continue
			}
		}

	default:
		return nil
	}

	fmt.Println("---------result path", result.String())
	return result.Bytes()
}
