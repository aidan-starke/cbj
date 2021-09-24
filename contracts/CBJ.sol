// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CBJ is ERC20 {
    address public cbjAddress;

    constructor(uint256 _initialSupply) ERC20("Crypto Blackjack", "CBJ") {
        _mint(msg.sender, _initialSupply * (10**decimals()));
        cbjAddress = address(this);
    }

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }

    receive() external payable {}
}
