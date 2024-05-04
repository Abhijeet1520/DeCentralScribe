DeCentralScribe 

World ID lets you seamlessly integrate authentication into your app that verifies accounts belong to real persons through Sign in with Worldcoin. For additional flexibility and cases where you need extreme privacy, Anonymous Actions lets you verify users in a way that cannot be tracked across verifications.

## Overview  

Donation is to be done in CCIP tokens (CCIP-BnM) using chainlink.   

DeCentralScribe is the main contract: it implements ERC-1155 that handles erc-1155 minting of tokens representing access to articles.
   
Donations are done in CCIP tokens and allows for cross-chain donations.

This means that we require an additional contract that implements "CCIPReceiver" and which will call DeCentralScribe.

CCIPReceiver in turn requires a "router" which is what handles OnRamp and OffRamp between crosschain calls 


## Donation Aggregator  

Tracks earnings of article creators through a mapping and dedicated withdraw function (pull pattern to avoid issues).  


## DeCentralScribe   

ERC-1155 based contract handling minting of NFTs for article access 

Extended by DonationAggregator.  

Notes: Need to add ERC1155 supply, to keep track in contract of whether a given id already exists? 
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.5/contracts/token/ERC1155/extensions/ERC1155Supply.sol 

