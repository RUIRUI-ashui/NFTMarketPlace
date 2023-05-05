# NFT Marketplace Smart Contract Development
## Final Project for course ELEN 6883 Blockchain 
### Overview
This project presents the design and implementation of a secure and efficient NFT marketplace smart contract that enables the creation, buying, selling, and trading of unique digital assets in the form of Non-Fungible Tokens (NFTs). The project involves the development of an ERC-721 compliant smart contract, and the implementation of additional features to ensure security and usability. The marketplace smart contract covers the NFT lifecycle from minting to trading, querying, and providing a comprehensive solution for users to interact with NFTs in a secure and efficient manner.

The testing of the NFT Collection and NFT Marketplace smart contracts using the Truffle framework and Mocha testing framework with the Chai assertion library has been successful, with all tests passing. These results demonstrate that the smart contract functions as intended, allowing users to list, buy, sell, and trade NFTs securely and efficiently.

Overall, this project provides a valuable contribution to the NFT ecosystem, providing a secure and efficient NFT marketplace that can be used by artists, musicians, and other creators to monetize their work and engage with their fans. The availability of the project code on Github makes it easy for other developers to use and build on the work done in this project to create even more sophisticated NFT marketplaces and applications.


### Installing

First, you will need to install the dependencies with: `npm install`.

Run the following command in your terminal after cloning the main repo:

```
$ npm install
```

Then, you will need to install Truffle globally by running the following command int your terminal:

```
$ npm install -g truffle
```

### Running the Tests

First, you will have to compile the smart contracts by running the following command in your terminal:

```
$ truffle compile
```

Then you will have to install and run Ganache to run your blockchain locally:

https://www.trufflesuite.com/ganache

Then, the tests that validate your solution can be executed by runing the following
command:

```
$ truffle test
```

### Deployment on Local Blockchain

Deploy the contracts on your Ganache local blockchain by running the following command:

```
$ truffle migrate
```
### Contributions of Each Team Member
Lei Xu(lx2301), Hongzhe You(hy2762), and Anqi Xue(ax2170) are responsible for designing and implementing the NFT marketplace smart contract. They are responsible for writing the Solidity code for the contract, testing it, and ensuring that it is secure and efficient. They are also responsible for implementing additional features, such as access control and error handling, to ensure the contract is reliable.

Haozhong jia(hj2622), Haoran Wang(hw2897), and Fengyuan Ye(fy2294) are responsible for ensuring that the NFT marketplace smart contract is fully tested and functional. They are also responsible for writing and executing test cases, identifying and reporting bugs, and ensuring that the software meets the project requirements and quality standards.
