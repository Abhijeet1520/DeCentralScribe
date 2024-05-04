// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DonationAggregator.sol";

contract IdTracker {
    mapping(address => uint) public idTracker;
    

    /// 
    function isValidId(address account, uint id) internal view returns (bool) {
        return id == idTracker[account];
    }

    function incrementTrackedId(address account) internal {
        idTracker[account] += 1;
    }
}