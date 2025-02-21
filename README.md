# vote_to_earn
# Voting Rewards Smart Contract

## Overview
This Solidity-based smart contract implements a simple voting system where participants are rewarded with tokens for casting their votes. Each voter can vote only once, and upon doing so, they receive a fixed number of tokens as a reward. The contract maintains a record of votes and token balances for each voter.

## Features
- **One-Time Voting**: Each address can vote only once.
- **Token Rewards**: Users receive a fixed reward of 10 tokens upon voting.
- **Total Votes Tracking**: The contract keeps track of the total number of votes cast.
- **Reward Balance Check**: Voters can check their earned token balance.

## Deployment
The contract is deployed on the **Edu Chain** at the following address:

**Contract Address:** `0x89303827dF8223736e241C63D97E39eF441CD841`

## Functions
- `vote()`: Allows a user to cast a vote and receive tokens.
- `getRewardBalance()`: Returns the token balance of the caller.

## Usage
1. Deploy the contract to the Ethereum-compatible blockchain.
2. Users can call the `vote()` function to cast their vote.
3. Users can check their token rewards using the `getRewardBalance()` function.

## License
This project is open-source and available under the MIT License.

