//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Bag is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _bagIds;
    address contractAddress;

    constructor(address _houseAddress) ERC721("Chip Bag", "BAG") {
        contractAddress = _houseAddress;
    }

    function mintBag(string memory _bagURI) public returns (uint256) {
        _bagIds.increment();
        uint256 newBagId = _bagIds.current();

        _mint(contractAddress, newBagId);
        _setTokenURI(newBagId, _bagURI);
        setApprovalForAll(contractAddress, true);

        return newBagId;
    }

    function totalSupply() external view returns (uint256) {
        return _bagIds.current();
    }
}
