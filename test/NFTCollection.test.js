const { expectRevert } = require('@openzeppelin/test-helpers');

const NFTCollection = artifacts.require('./NFTCollection.sol');

contract('NFTCollection', (accounts) => {
  let contract;

  before(async () => {
    contract = await NFTCollection.new();
  });

  describe('deployment', () => {
    it('deploys successfully', async () => {
      const address = contract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async() => {
      const name = await contract.name();
      assert.equal(name, 'NFT Collection');
    });

    it('has a symbol', async() => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'NFT');
    });
  });
  


  describe('minting', () => {
    it('creates a new token', async () => {
      const result = await contract.createNFT('testURI', "test", "description");
      const totalSupply = await contract.totalSupply();

      // SUCCESS
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
      assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same URI twice
      await expectRevert(contract.createNFT('testURI', "test", "description"), 'The token URI should be unique');
    });

    it('token URI is correctly assigned', async() => {
      // SUCCESS
      const tokenURI = await contract.tokenURI(1);
      assert.equal(tokenURI, 'testURI');

      // FAILURE
      await expectRevert(contract.tokenURI(2), 'ERC721Metadata: URI query for nonexistent token');
    });

    it('token details is correctly assigned', async() => {
      // SUCCESS
      const details = await contract._tokenIdToDetail(1);
      assert.equal(details[1], 'test');
      assert.equal(details[2], 'description');
    });

    it('token transfer to other account', async() => {
      // SUCCESS
      await contract.transferNFT(1,accounts[2])
      assert.equal(await contract.ownerOf(1), accounts[2]);
    });
    it('token transfer to other account not by the owner, should fail', async() => {
      // SUCCESS
      await expectRevert(contract.transferNFT(1,accounts[2],{from: accounts[3]}),'Only the owner can transfer the NFT.')
    });
  });

  describe('Access Control', () => {
    it('Only the contract\'s onwner can call the CreateNFT function', async () => {
    await contract.createNFT('testURI2', "test", "description")      
    });
    it('Other cannot call the CreateNFT function', async () => {
      await expectRevert(contract.createNFT('testURI3', "test", "description",{from: accounts[3]})," ")  
      });
  });
});
