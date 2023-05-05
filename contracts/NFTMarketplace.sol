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

  function purchaseNFT(uint _purchaseId) public payable {
    _Purchase storage _purchase = purchases[_purchaseId];
    require(_purchase.purchaseId == _purchaseId, 'The purchase must exist');
    require(_purchase.user != msg.sender, 'The owner of the purchase cannot fill it');
    require(!_purchase.purchased, 'An purchase cannot be purchased twice');
    require(!_purchase.removed, 'A removed purchase cannot be purchased');
    require(msg.value == _purchase.price, 'The ETH amount should match with the NFT Price');
    nftCollection.transferFrom(address(this), msg.sender, _purchase.id);
    _purchase.purchased = true;
    userFunds[_purchase.user] += msg.value;
    emit PurchaseFilled(_purchaseId, _purchase.id, msg.sender);
  }

  function removeNFTFromSale(uint _purchaseId) public {
    _Purchase storage _purchase = purchases[_purchaseId];
    require(_purchase.purchaseId == _purchaseId, 'The purchase must exist');
    require(_purchase.user == msg.sender, 'The purchase can only be canceled by the owner');
    require(_purchase.purchased == false, 'A purchased purchase cannot be removed');
    require(_purchase.removed == false, 'An purchase cannot be removed twice');
    nftCollection.transferFrom(address(this), msg.sender, _purchase.id);
    _purchase.removed = true;
    emit PurchaseCancelled(_purchaseId, _purchase.id, msg.sender);
  }

  function claimFunds() public {
    require(userFunds[msg.sender] > 0, 'This user has no funds to be claimed');
    payable(msg.sender).transfer(userFunds[msg.sender]);
    emit ClaimFunds(msg.sender, userFunds[msg.sender]);
    userFunds[msg.sender] = 0;    
  }

  // Fallback: reverts if Ether is sent to this smart-contract by mistake
  fallback () external {
    revert();
  }
}