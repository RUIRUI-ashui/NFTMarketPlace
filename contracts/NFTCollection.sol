pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721, ERC721Enumerable, Ownable {
  string[] public tokenURIs;
  mapping(string => bool) _tokenURIExists;
  mapping(uint => string) _tokenIdToTokenURI;
  mapping(uint => tokenDetails) public _tokenIdToDetail;
  
  struct tokenDetails{
    uint tokenId;
    string name;
    string description;
  }

  event NewNFTCollectionMint(uint id, string tokenURI, string name, string description);
  event NFTTransferedByOwner(address from, address to, uint id);

  constructor() 
    ERC721("NFT Collection", "NFT") 
  {
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public override view returns (string memory) {
    require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
    return _tokenIdToTokenURI[tokenId];
  }

  function createNFT(string memory _tokenURI, string memory _name, string memory _description) public onlyOwner{
    require(!_tokenURIExists[_tokenURI], 'The token URI should be unique');
    tokenURIs.push(_tokenURI);    
    uint _id = tokenURIs.length;
    _tokenIdToTokenURI[_id] = _tokenURI;
    _safeMint(msg.sender, _id);
    _tokenURIExists[_tokenURI] = true;
    _tokenIdToDetail[_id] = tokenDetails(_id,_name,_description);
    emit NewNFTCollectionMint(_id, _tokenURI,_name, _description);
  }

  function transferNFT(uint _id, address _to) public {
    require(msg.sender == super.ownerOf(_id), 'Only the owner can transfer the NFT.');
    emit NFTTransferedByOwner(msg.sender, _to, _id);
    return super.safeTransferFrom(msg.sender, _to, _id);
  }
}