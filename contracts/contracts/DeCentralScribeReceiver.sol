// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC677Receiver} from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/IERC677Receiver.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {DeCentralScribe} from "./DeCentralScribe.sol";
import {IRelayTransferERC20} from "./Interfaces/IRelayTransferErc20.sol";


contract DeCentralScribeReceiver is
    CCIPReceiver,
    OwnerIsCreator,
    IERC677Receiver,
    IRelayTransferERC20
{
    DeCentralScribe public target;

    address public paymentToken;

    event MintCallSuccessfull();

    constructor(
        address router,
        address _target,
        address _paymentToken
    ) CCIPReceiver(router) {
        if (_target != address(0)) {
            target = DeCentralScribe(_target);
        }
        paymentToken = _paymentToken;
    }

    function updateTarget(address _newTarget) external {
        target = DeCentralScribe(_newTarget);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        require(
            message.destTokenAmounts[0].token == paymentToken,
            "Invalid Denomination for payment"
        );
        //(bool success, ) = address(target).call(message.data);

        // call data should contain the tokenId to mint
        target.mintErc20(
            abi.decode(message.sender, (address)), // sender address
            abi.decode(message.data, (uint256)), // tokenId
            message.destTokenAmounts[0].amount,
            new bytes(0)
        );
        emit MintCallSuccessfull();
    }

    function onTokenTransfer(
        address sender,
        uint256 amount,
        bytes calldata data
    ) external {
        require(msg.sender == paymentToken, "Unauthorized");

        target.mintErc20(
            sender,
            abi.decode(data, (uint256)),
            amount,
            new bytes(0)
        );

    }

    function transferTokens(address beneficiary, uint256 amount) external {
        require(msg.sender == address(target), "Unauthorized");
        ERC20(paymentToken).transfer(beneficiary, amount);
    }
}
