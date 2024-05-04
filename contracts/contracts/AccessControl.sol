// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum AccessStatus {
    Unknown,
    Authorized,
    Banned
}


contract AccessControl {
    address public controlAdmin;
    mapping(address => AccessStatus) public accessStatusTracker;

    error NotAllowedAccess(address user);

    constructor(address _controlAdmin) {
        controlAdmin = _controlAdmin;
    }

    function setAccessStatus(address user, AccessStatus newStatus) external {
        require(msg.sender == controlAdmin, "Unauthorized");
        accessStatusTracker[user] = newStatus;
    }

    function setAccessControlAdmin(address newAdmin) external {
        require(msg.sender == controlAdmin, "Unauthorized");
        controlAdmin = newAdmin;
    }
}
