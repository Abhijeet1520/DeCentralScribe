### DeCentralScribe : Where every story is an asset, and every contribution is cherished 🖊️

**Tagline**: A decentralised Blog Publishing Revolutionary platform powered by mantle, base and Chainlink CCIP for cross-chain support to the creators.

## Introduction

Welcome to **DeCentralScribe**, where the art of writing meets the innovation of blockchain. As a pioneering decentralized publishing platform powered by mantle and base, DeCentralScribe offers a comprehensive ecosystem for writers, readers, and crypto-enthusiasts. By merging the timeless tradition of storytelling with cutting-edge blockchain technology, DeCentralScribe not only champions freedom of expression but also redefines content monetization and ownership.

- Write a decentralised blog -> Mint it into NFT  -> Share with supporters->get Empowered and cross-chain support from supporters of your work, they intern recieve memorable erc1155-NFTs automatically from your collection as mark of onchain support.


## Technologies used

1. Sign in with Worldcoin and Anonymous Support

At DeCentralScribe, we prioritize user privacy and security while ensuring a seamless experience for both creators and supporters. That's why we've integrated Sign in with Worldcoin authentication, allowing users to verify their accounts effortlessly while ensuring that they belong to real persons. This not only enhances the credibility of our platform but also fosters trust among our community members.

Additionally, we understand that some users may value extreme privacy in their interactions. That's where our Anonymous Actions feature comes into play. With Anonymous Actions, users can support authors anonymously, without their actions being tracked across verifications. This ensures maximum privacy for users who prefer to keep their contributions discreet while still empowering authors and enriching our community.

### Benefits of Sign in with Worldcoin:

- **Streamlined Authentication**: Users can sign in to DeCentralScribe with their Worldcoin accounts seamlessly, eliminating the need for complex registration processes and enhancing user convenience.
  
- **Enhanced Security**: Sign in with Worldcoin leverages Worldcoin's robust authentication system, adding an extra layer of security to user accounts and protecting them from unauthorized access.

- **Verified Identities**: By verifying accounts through Sign in with Worldcoin, DeCentralScribe ensures that users are real individuals, reducing the risk of fake accounts and fraudulent activities within our ecosystem.

### Benefits of Anonymous Support:

- **Privacy Protection**: Anonymous Actions enable users to support authors without revealing their identities, preserving their privacy and anonymity throughout the donation process.

- **Freedom of Expression**: Users who value privacy can express their appreciation for authors without concerns about their actions being traced back to them, encouraging more individuals to contribute and engage within our community.

- **Inclusive Environment**: By offering anonymous support options, DeCentralScribe creates a more inclusive environment where users from diverse backgrounds and preferences feel comfortable participating and contributing to the success of our platform.

World ID lets you seamlessly integrate authentication into your app that verifies accounts belong to real persons through Sign in with Worldcoin. For additional flexibility and cases where you need extreme privacy, Anonymous Actions lets you verify users in a way that cannot be tracked across verifications.

2. Crosschain payments using Chainlink’s CCIP
By making use of the CCIP protocol implemented by Chainlink, we allow supporters for interaction with the protocol from many EVM-based blockchains, such as Ethereum, Arbitrum, Polygon, Base and many others.

3. Easy Onramp and Offramp using Unlimit Protocol

- **Seamless Transactions**: With the integration of Unlimit Protocol, DeCentralScribe offers users a frictionless experience when it comes to onboarding and offboarding funds. Whether you're depositing or withdrawing, the process is streamlined, ensuring efficiency and convenience for all participants.
- **Cross-Chain Compatibility**: Unlimit Protocol's cross-chain capabilities enable users to seamlessly move assets between different blockchain networks. This not only expands accessibility but also enhances interoperability, fostering a more interconnected ecosystem for creators and supporters alike.

4. Deployed on Base, Sepolia, and Mantle Chain

- **Diverse Ecosystem**: By deploying across multiple blockchain networks such as Base, Sepolia, and Mantle Chain, DeCentralScribe ensures a robust and resilient infrastructure for its platform. This strategic decision not only enhances scalability but also mitigates risks associated with network congestion or disruptions.
- **Maximized Reach**: Leveraging the capabilities of Base, Sepolia, and Mantle Chain allows DeCentralScribe to tap into diverse user bases and communities across different blockchain ecosystems. This broadens the platform's reach and accessibility, enabling more individuals to participate in the decentralized publishing revolution.


## Features

### 🖋 **Seamless Writing & Publishing**

- **Intuitive Authoring Tools**: DeCentralScribe provides a rich, user-friendly interface, making the journey from thought to publication effortless and enjoyable for writers of all calibers.
- **Curated Reading Experience**: Delve into a vast collection of writings across various genres. DeCentralScribe is your gateway to exploring, discovering, and getting inspired by content that matters to you.

### 🎨 **NFT Minting & Ownership**

- **Your Work, Your Asset**: Transform your articles and stories into unique NFTs, offering a new dimension of content ownership and value creation.
- **Rights & Royalties**: With each piece minted, authors maintain indisputable ownership, benefit from content tracking, and earn from subsequent trades or transactions.

### 💫 **Engage & Support**

- **Direct Support with Cryptocurrency**: Show your appreciation for your favorite authors by directly donating cryptocurrencies like SOL, USDC, and USDT, or engage in cross-chain donations with Chainlink CCIP technology.
- **Earn Compressed NFTs**: Supporters are rewarded with exclusive compressed NFTs as a token of gratitude and proof of their support, bridging a unique connection between the author and the audience.


## DeCentralScribe Contracts

ERC-1155 based contract handling minting of NFTs for blog access 

1. **TokenUtils.sol**:
   - The `createTokenId` function seems fine. It generates a unique token ID based on the creator's address, article ID, and whether it's a paying article.
   - The `parseTokenId` function extracts the creator's address, article ID, and whether it's a paying article from a token ID.
   - The `findAlternateId` function finds the alternate ID by switching the "isPaying" bit. It can be useful for certain functionalities like swapping paid/free articles.

2. **IdTracker.sol**:
   - This contract seems to track the IDs of articles for each creator.
   - It has a function to check the validity of an ID and to increment the tracked ID for a specific creator.

3. **DonationAggregator.sol**:
   - This contract is responsible for aggregating donations made to authors.
   - It includes a function `_withdraw` to transfer aggregated funds to a specified beneficiary using `IRelayTransferERC20`.
   - Consider uncommenting and refining the `withdraw` function to allow users to withdraw their accumulated funds.

4. **DeCentralScribe.sol**:
   - This is the main contract where supporters can mint tokens for articles in the form of ERC1155 tokens.
   - It includes functions to mint tokens (`mintErc20`) and withdraw funds (`withdraw`).
   - Refine the `mintErc20` function to improve readability and efficiency.
   - Consider adding events to notify when tokens are minted or funds are withdrawn.
   - Ensure proper error handling and revert reasons for better user experience.

5. **DeCentralScribeReceiver.sol**:
   - This contract serves as the entry point for payments to `DeCentralScribe`.
   - Refine the `_ccipReceive` function to handle payment properly and securely.
   - Ensure that only authorized users can call sensitive functions.
   - Consider adding additional checks for security and reliability.

6. **BNMToken.sol**:
   - This contract implements the BNM token using BurnMintERC677 from Chainlink contracts.
   - It sets the token name, symbol, decimals, and max supply.
   - Ensure that the parameters for BurnMintERC677 are appropriate for your project's requirements.

## Why DeCentralScribe?

- **Decentralized Publishing**: At DeCentralScribe, we are committed to decentralization, ensuring that creators have full control and authority over their work. This foundational principle cultivates a rich, diversified community where every voice can be heard.
- **Transparent and Secure**: Leveraging the mantle and base blockchain, DeCentralScribe guarantees a level of transparency and security unmatched in traditional publishing platforms. Every interaction is immutable, providing trust and integrity to our community members.
- **Empowerment through Innovation**: We believe in empowering authors and supporters alike, offering tools and opportunities to revolutionize how content is created, shared, and valued in the digital age.

