// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC677} from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/ERC677.sol";

import {BurnMintERC677} from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/BurnMintERC677.sol";

contract BnMToken is BurnMintERC677("CCIP-BnM", "CCIP-BnM", 8, 5000000) {
    //  constructor(string memory name, string memory symbol, uint8 decimals_, uint256 maxSupply_) ERC677(name, symbol) {
}
