const { expectRevert } = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');

const NFTCollection = artifacts.require('./NFTCollection.sol');
const NFTMarketplace = artifacts.require('./NFTMarketplace.sol');

contract('NFTMarketplace', (accounts) => {
  let nftContract;
  let mktContract;

  before(async () => {
    nftContract = await NFTCollection.new();

    const NFTaddress = nftContract.address;
    mktContract = await NFTMarketplace.new(NFTaddress);

    await nftContract.createNFT('testURI', "test1", "description");
    await nftContract.createNFT('testURI2',"test2", "description");
  });

  describe('List NFT for Sale', () => {
    it('Requires the approval from the user', async () => {
      await expectRevert(mktContract.listNFTForSale(1, 10), 'ERC721: caller is not token owner or approved');
    });

    before(async() => {
      await nftContract.approve(mktContract.address, 2);
      await mktContract.listNFTForSale(2, 10);      
    })

    it('Transfers the ownership to this contract', async() => {
      const owner = await nftContract.ownerOf(2);
      assert.equal(owner, mktContract.address);
    });

    it('Creates an purchase', async() => {
      const purchase = await mktContract.purchases(1);
      assert.equal(purchase.purchaseId.toNumber(), 1);
      assert.equal(purchase.id.toNumber(), 2);
      assert.equal(purchase.user, accounts[0]);
      assert.equal(purchase.price.toNumber(), 10);
      assert.equal(purchase.purchased, false);
      assert.equal(purchase.removed, false);
    });

    it('Emits an Event list NFT for sale', async() => {
      await nftContract.approve(mktContract.address, 1);
      const result = await mktContract.listNFTForSale(1, 20);
      const log = result.logs[0];
      assert.equal(log.event, 'Purchase');
      const event = log.args;
      assert.equal(event.purchaseId.toNumber(), 2);
      assert.equal(event.id.toNumber(), 1);
      assert.equal(event.user, accounts[0]);
      assert.equal(event.price.toNumber(), 20);
      assert.equal(event.purchased, false);
      assert.equal(event.removed, false);
    });
  });

  describe('Purchase a NFT', () => {
    it('purchase the NFT and emits Event', async() => {
      const result = await mktContract.purchaseNFT(1, { from: accounts[1], value: 10 });
      const purchase = await mktContract.purchases(1);
      assert.equal(purchase.purchased, true);
      const userFunds = await mktContract.userFunds(purchase.user);
      assert.equal(userFunds.toNumber(), 10);

      const log = result.logs[0];
      assert.equal(log.event, 'PurchaseFilled');
      const event = log.args;
      assert.equal(event.purchaseId.toNumber(), 1);
    });
    
    it('The NFT must exist', async() => {
      await expectRevert(mktContract.purchaseNFT(3, { from: accounts[1] }), 'The purchase must exist');
    });

    it('The owner cannot buy it', async() => {
      await expectRevert(mktContract.purchaseNFT(2, { from: accounts[0] }), 'The owner of the purchase cannot fill it');
    });

    it('Cannot be puchased twice', async() => {
      await expectRevert(mktContract.purchaseNFT(1, { from: accounts[1] }), 'An purchase cannot be purchased twice');
    });

    it('A completed(puchased) cannot be removed', async() => {
      await expectRevert(mktContract.removeNFTFromSale(1, { from: accounts[0] }), 'A purchased purchase cannot be removed');
    });

    it('The ETH sent should match the price', async() => {
      await expectRevert(mktContract.purchaseNFT(2, { from: accounts[1], value: 5 }), 'The ETH amount should match with the NFT Price');
    });
  });

  describe('Remove NFT from Sale', () => {
    it('Only the owner can cancel', async() => {
      await expectRevert(mktContract.removeNFTFromSale(2, { from: accounts[1] }), 'The purchase can only be canceled by the owner');
    });
    
    it('remove NFT from sale and emits Event', async() => {
      const result = await mktContract.removeNFTFromSale(2, { from: accounts[0] });
      const purchase = await mktContract.purchases(2);
      assert.equal(purchase.removed, true);

      const log = result.logs[0];
      assert.equal(log.event, 'PurchaseCancelled');
      const event = log.args;
      assert.equal(event.purchaseId.toNumber(), 2);
    });
    
    it('The NFT exist', async() => {
      await expectRevert(mktContract.removeNFTFromSale(3, { from: accounts[0] }), 'The purchase must exist');
    });    

    it('Cannot be removed twice', async() => {
      await expectRevert(mktContract.removeNFTFromSale(2, { from: accounts[0] }), 'An purchase cannot be removed twice');
    });

    it('The NFT being removed cannot be purchased again', async() => {
      await expectRevert(mktContract.purchaseNFT(2, { from: accounts[1] }), 'A removed purchase cannot be purchased');
    });
  });

  describe('Claim funds', () => {
    it('Rejects users without funds to claim', async() => {
      await expectRevert(mktContract.claimFunds({ from: accounts[1] }), 'This user has no funds to be claimed');
    });

    it('Pays the correct amount and emits Event', async() => {
      const fundsBefore = await mktContract.userFunds(accounts[0]);
      const result = await mktContract.claimFunds({ from: accounts[0] });
      const fundsAfter = await mktContract.userFunds(accounts[0]);
      assert.equal(fundsBefore.toNumber(), 10);
      assert.equal(fundsAfter.toNumber(), 0);

      const log = result.logs[0];
      assert.equal(log.event, 'ClaimFunds');
      const event = log.args;
      assert.equal(event.user, accounts[0]);
      assert.equal(event.amount.toNumber(), 10);
    });
  });
});