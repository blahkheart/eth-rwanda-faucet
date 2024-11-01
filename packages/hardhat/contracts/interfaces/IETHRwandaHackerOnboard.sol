// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IETHRwandaHackerOnboard {
    function getIsHackerInitialized(address _hacker) external view returns(bool);
}
