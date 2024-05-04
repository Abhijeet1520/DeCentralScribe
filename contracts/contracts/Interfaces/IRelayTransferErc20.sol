// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


interface IRelayTransferERC20 {
    //address target;
    //address paymentToken;

    function transferTokens(address beneficiary, uint256 amount) external; 
    /* {
        //require(msg.sender == address(target), "Unauthorized");
        IERC20(paymentToken).transfer(beneficiary, amount);
    }*/
}
