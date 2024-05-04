// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import {IRelayTransferERC20} from "./Interfaces/IRelayTransferErc20.sol";

contract DonationAggregator {
    mapping(address => uint) public aggregated;

    /*
    function withdraw(address receiverAddress) public {
        uint amount = aggregated[msg.sender];

        if (amount == 0) {
            revert("No funds to withdraw");
        } else {
            aggregated[msg.sender] = 0;
            //require(payable(msg.sender).send(amount), "Transfer failed");
            IRelayTransferERC20(receiverAddress).transferTokens(receiverAddress, amount);
        }
    }
    */

    function _withdraw(address beneficiary, uint256 amount, address proxy) internal {
        aggregated[msg.sender] = 0;
        IRelayTransferERC20(proxy).transferTokens(beneficiary, amount);
    }
}