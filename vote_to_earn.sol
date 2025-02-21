pragma solidity ^0.8.0;

contract VotingRewards {
    mapping(address => bool) public hasVoted;
    mapping(address => uint256) public tokens;
    uint256 public totalVotes;
    uint256 public rewardAmount = 10; // Fixed token reward per vote

    function vote() public {
        require(!hasVoted[msg.sender], "You have already voted");
        hasVoted[msg.sender] = true;
        tokens[msg.sender] += rewardAmount;
        totalVotes += 1;
    }
    
    function getRewardBalance() public view returns (uint256) {
        return tokens[msg.sender];
    }
}
