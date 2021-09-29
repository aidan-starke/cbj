// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract House is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    uint256 bagPrice = 0.025 ether;
    uint256 chipPrice = 0.0001 ether;

    address payable owner;
    address cbjAddress;

    constructor(address _cbjAddress) {
        owner = payable(msg.sender);
        cbjAddress = _cbjAddress;
    }

    struct Bag {
        uint256 itemId;
        address bagContract;
        uint256 bagId;
        uint256 chips;
        address payable owner;
    }

    mapping(address => Bag) private addressToBag;

    event BagCreated(
        uint256 indexed itemId,
        address indexed bagContract,
        uint256 bagId,
        address owner
    );

    event ChipsBought(uint256 indexed chips, uint256 bagId, address owner);
    event ChipsCashedIn(uint256 chips, uint256 bagId, address owner);

    function getBagPrice() public view returns (uint256) {
        return bagPrice;
    }

    function getChipPrice() public view returns (uint256) {
        return chipPrice;
    }

    function totalSupply() external view returns (uint256) {
        return _itemIds.current();
    }

    modifier onlyOneBag() {
        require(
            addressToBag[msg.sender].owner == address(0),
            "Only one bag per person"
        );
        _;
    }

    modifier onlyBagOwner() {
        require(
            addressToBag[msg.sender].owner == msg.sender,
            "Only bag owner can access bag"
        );
        _;
    }

    function bagExists() external view returns (bool) {
        return addressToBag[msg.sender].owner != address(0);
    }

    function getBag() external view onlyBagOwner returns (Bag memory bag) {
        return addressToBag[msg.sender];
    }

    function createBag(address _bagContract, uint256 _bagId)
        public
        payable
        nonReentrant
        onlyOneBag
    {
        require(msg.value == bagPrice, "Price must equal bag purchase price");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        addressToBag[msg.sender] = Bag(
            itemId,
            _bagContract,
            _bagId,
            0,
            payable(msg.sender)
        );

        emit BagCreated(itemId, _bagContract, _bagId, msg.sender);
    }

    function getChipBalance() external view onlyBagOwner returns (uint256) {
        return addressToBag[msg.sender].chips;
    }

    function buyChips(uint256 _amount) public payable nonReentrant {
        require(
            msg.value == chipPrice * _amount,
            "Price must equal value of chips"
        );

        IERC20(cbjAddress).transferFrom(msg.sender, address(this), msg.value);
        addressToBag[msg.sender].chips += _amount;

        emit ChipsBought(_amount, addressToBag[msg.sender].bagId, msg.sender);
    }

    modifier enoughChips(uint256 _amount) {
        require(
            addressToBag[msg.sender].chips >= _amount,
            "Must have enough chips"
        );
        _;
    }

    function cashIn(uint256 _amount) public nonReentrant enoughChips(_amount) {
        uint256 value = _amount * chipPrice;
        IERC20(cbjAddress).transfer(msg.sender, value);
        addressToBag[msg.sender].chips -= _amount;

        emit ChipsCashedIn(_amount, addressToBag[msg.sender].bagId, msg.sender);
    }
}
