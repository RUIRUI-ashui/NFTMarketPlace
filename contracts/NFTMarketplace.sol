pragma solidity ^0.8.0;

import "./NFTCollection.sol";

contract NFTMarketplace {
  uint public purchaseCount;
  mapping (uint => _Purchase) public purchases;
  mapping (address => uint) public userFunds;
  NFTCollection nftCollection;

  struct _Purchase {
    uint purchaseId;
    uint id;
    address user;
    uint price;
    bool purchased;
    bool removed;
  }

  event Purchase(
    uint purchaseId,
    uint id,
    address user,
    uint price,
    bool purchased,
    bool removed
  );

  event PurchaseFilled(uint purchaseId, uint id, address newOwner);
  event PurchaseCancelled(uint purchaseId, uint id, address owner);
  event ClaimFunds(address user, uint amount);

  constructor(address _nftCollection) {
    nftCollection = NFTCollection(_nftCollection);
  }
  
    function listNFTForSale(uint _id, uint _price) public {
    nftCollection.transferFrom(msg.sender, address(this), _id);
    purchaseCount ++;
    purchases[purchaseCount] = _Purchase(purchaseCount, _id, msg.sender, _price, false, false);
    emit Purchase(purchaseCount, _id, msg.sender, _price, false, false);
  }

}