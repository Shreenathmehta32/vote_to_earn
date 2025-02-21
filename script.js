// Contract ABI (simplified to match your Solidity contract)
const contractABI = [
    {
        "inputs": [],
        "name": "getRewardBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "tokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalVotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Contract address (you'll need to replace this after deploying your contract)
const contractAddress = "0x89303827dF8223736e241C63D97E39eF441CD841"; // Replace with your deployed contract address

// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet');
const walletStatus = document.getElementById('wallet-status');
const voteButton = document.getElementById('vote-button');
const votingStatus = document.getElementById('voting-status');
const totalVotesElement = document.getElementById('total-votes');
const rewardBalanceElement = document.getElementById('reward-balance');

// Global variables
let web3;
let votingContract;
let userAccount;

// Initialize the application
async function init() {
    // Check if MetaMask is installed
    if (window.ethereum) {
        try {
            // Initialize Web3 with MetaMask provider
            web3 = new Web3(window.ethereum);
            
            // Create contract instance
            votingContract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Setup event listeners
            setupEventListeners();
            
            // Check if already connected
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                userAccount = accounts[0];
                updateUIAfterConnection();
            }
        } catch (error) {
            console.error("Error initializing Web3:", error);
            votingStatus.textContent = "Failed to connect to blockchain. Please refresh and try again.";
            votingStatus.className = "error";
        }
    } else {
        votingStatus.textContent = "MetaMask is not installed. Please install MetaMask to use this dApp.";
        votingStatus.className = "error";
        connectWalletBtn.disabled = true;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Connect wallet button
    connectWalletBtn.addEventListener('click', connectWallet);
    
    // Vote button
    voteButton.addEventListener('click', castVote);
    
    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                userAccount = accounts[0];
                updateUIAfterConnection();
            } else {
                resetUI();
            }
        });
        
        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }
}

// Connect wallet function
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        updateUIAfterConnection();
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        votingStatus.textContent = "Failed to connect wallet. Please try again.";
        votingStatus.className = "error";
    }
}

// Update UI after successful connection
async function updateUIAfterConnection() {
    // Update wallet status
    walletStatus.textContent = `Connected: ${shortenAddress(userAccount)}`;
    walletStatus.className = "connected";
    connectWalletBtn.textContent = "Wallet Connected";
    
    // Enable vote button
    voteButton.disabled = false;
    
    // Check if user has already voted
    await checkVotingStatus();
    
    // Update stats
    await updateStats();
}

// Reset UI when disconnected
function resetUI() {
    walletStatus.textContent = "Wallet not connected";
    walletStatus.className = "";
    connectWalletBtn.textContent = "Connect Wallet";
    voteButton.disabled = true;
    votingStatus.textContent = "Connect your wallet to vote";
    votingStatus.className = "";
    totalVotesElement.textContent = "0";
    rewardBalanceElement.textContent = "0 tokens";
}

// Cast vote function
async function castVote() {
    try {
        votingStatus.textContent = "Processing your vote...";
        votingStatus.className = "";
        voteButton.disabled = true;
        
        // Call vote function on smart contract
        await votingContract.methods.vote().send({ from: userAccount });
        
        votingStatus.textContent = "Thank you for voting! Tokens awarded.";
        votingStatus.className = "success";
        
        // Update stats after voting
        await updateStats();
    } catch (error) {
        console.error("Error while voting:", error);
        
        // Handle the common error cases
        if (error.message.includes("You have already voted")) {
            votingStatus.textContent = "You have already voted.";
        } else {
            votingStatus.textContent = "Error while processing your vote. Please try again.";
        }
        
        votingStatus.className = "error";
        await checkVotingStatus();
    }
}

// Check if user has already voted
async function checkVotingStatus() {
    try {
        const hasVoted = await votingContract.methods.hasVoted(userAccount).call();
        
        if (hasVoted) {
            votingStatus.textContent = "You have already voted.";
            votingStatus.className = "success";
            voteButton.disabled = true;
        } else {
            votingStatus.textContent = "Ready to cast your vote!";
            voteButton.disabled = false;
        }
    } catch (error) {
        console.error("Error checking voting status:", error);
    }
}

// Update stats (total votes and reward balance)
async function updateStats() {
    try {
        // Get total votes
        const totalVotes = await votingContract.methods.totalVotes().call();
        totalVotesElement.textContent = totalVotes;
        
        // Get user's reward balance
        const rewardBalance = await votingContract.methods.getRewardBalance().call({ from: userAccount });
        rewardBalanceElement.textContent = `${rewardBalance} tokens`;
    } catch (error) {
        console.error("Error updating stats:", error);
    }
}

// Helper function to shorten address for display
function shortenAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Initialize the application when the page loads
window.addEventListener('load', init);
