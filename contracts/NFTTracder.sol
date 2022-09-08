// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTTrader{

    mapping(address => mapping(uint256 => listing)) public listings;
    mapping(address => uint256) public balances;

    struct listing{
        uint256 price;
        address seller;
    }

    function addListing(uint256 price, address constractAddr, uint256 tokenId) public{
        ERC721 token = ERC721(constractAddr);
        require(token.balanceOf(msg.sender)>0, "caller must own given token");
        require(token.isApprovedForAll(msg.sender, address(this)),"Contract must be approve");

        listings[constractAddr][tokenId] = listing(price, msg.sender);
    }

    function purchase(address constractAddr, uint256 tokenId, uint256 amount) public payable{
        listing memory item = listings[constractAddr][tokenId];
        require(msg.value >= item.price*amount, "insufficient funds send");
        balances[item.seller] += msg.value;
        
        ERC721 token = ERC721(constractAddr);
        token.safeTransferFrom(item.seller, msg.sender, tokenId, "");
        delete listings[constractAddr][tokenId];
    }

    function withdraw(uint256 amount, address payable destAddr) public {
        require(amount <= balances[msg.sender], "insufficient funds");

        destAddr.transfer(amount);
        balances[msg.sender] -= amount;
    }
}