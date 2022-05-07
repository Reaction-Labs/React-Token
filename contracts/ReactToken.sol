// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReactToken is ERC20, Ownable {
    constructor(
        address contractOwner,
        address mintingDestination
    )
    public
    ERC20("Reaction", "React") {
        transferOwnership(contractOwner);
        // Initial supply is 500 million (500e6)
        // We are using ether because the token has 18 decimals like ETH
        _mint(mintingDestination, 500e6 ether);
    }
}