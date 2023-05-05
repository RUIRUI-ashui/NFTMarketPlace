pragma solidity ^0.8.0;

import "./NFTCollection.sol";

contract NFTMarketplace {
  uint public purchaseCount;
  mapping (uint => _Purchase) public purchases;
  mapping (address => uint) public userFunds;
  NFTCollection nftCollection;
  

  constructor(address _nftCollection) {
    nftCollection = NFTCollection(_nftCollection);
  }

}