package main

import "fmt"

var allowedTokens map[string]map[string]string

func init() {

	allowedTokens = make(map[string]map[string]string)
	var wethConfig = make(map[string]string)
	wethConfig["tokenInStr"] = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	wethConfig["tokenOutStr"] = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
	wethConfig["amountStr"] = "100000000"
	wethConfig["recipient"] = "0xD6153F5af5679a75cC85D8974463545181f48772"
	allowedTokens["WETH"] = wethConfig

	var wbtcConfig = make(map[string]string)
	wbtcConfig["tokenInStr"] = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	wbtcConfig["amountStr"] = "100000000"
	wbtcConfig["recipient"] = "0xD6153F5af5679a75cC85D8974463545181f48772"

	wbtcConfig["tokenOutStr"] = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
	allowedTokens["WBTC"] = wbtcConfig

	var uniConfig = make(map[string]string)
	uniConfig["tokenInStr"] = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	uniConfig["amountStr"] = "1000000000"
	uniConfig["recipient"] = "0xD6153F5af5679a75cC85D8974463545181f48772"

	uniConfig["tokenOutStr"] = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
	allowedTokens["UNI"] = uniConfig

	var pepeConfig = make(map[string]string)
	pepeConfig["tokenInStr"] = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	pepeConfig["amountStr"] = "100000000"
	pepeConfig["recipient"] = "0xD6153F5af5679a75cC85D8974463545181f48772"

	pepeConfig["tokenOutStr"] = "0x6982508145454ce325ddbe47a25d4ec3d2311933"
	allowedTokens["PEPE"] = pepeConfig

	var diaConfig = make(map[string]string)
	diaConfig["tokenInStr"] = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
	diaConfig["amountStr"] = "1000000000"
	diaConfig["recipient"] = "0xD6153F5af5679a75cC85D8974463545181f48772"
	// diaConfig["path"] = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,0x84ca8bc7997272c7cfb4d0cd3d55cd942b3c9419"
	diaConfig["tokenOutStr"] = "0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419"
	allowedTokens["DIA"] = diaConfig

	fmt.Println(allowedTokens)

}
