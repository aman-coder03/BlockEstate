// Updated script.js

let web3;
let contract;
let account;

// ABI from the compiled smart contract - this is crucial for interacting with the contract
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "location",
                "type": "string"
            }
        ],
        "name": "PropertyRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tenant",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "RentalAgreementCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "authorizeUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            }
        ],
        "name": "getPropertyCount",
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
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            }
        ],
        "name": "getPropertyDetails",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isForSale",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isForRent",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "studentDiscount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "sharePrice",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            }
        ],
        "name": "purchaseProperty",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isForSale",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isForRent",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "studentDiscount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "sharePrice",
                "type": "uint256"
            }
        ],
        "name": "registerProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contractAddress = "0xDcfA25174a46b06081847b6359198498ba9CCa20";  // Replace with your contract's address

// Connect to MetaMask
async function connectMetaMask() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request access to the user's MetaMask account
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Get the first account
            account = (await web3.eth.getAccounts())[0];
            console.log("Connected Account: ", account);

            // Initialize the contract
            contract = new web3.eth.Contract(abi, contractAddress);

            // Update UI to show connection status
            const connectButton = document.getElementById("connectButton");
            connectButton.textContent = "Connected";
            connectButton.classList.add("connected");
            
            // Show wallet address
            const truncatedAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            connectButton.textContent = `Connected: ${truncatedAddress}`;

            // Listen for account and network changes
            window.ethereum.on('accountsChanged', (accounts) => {
                account = accounts[0];
                console.log("Account changed to: ", account);
                
                if (accounts.length === 0) {
                    // User disconnected all accounts
                    connectButton.textContent = "Connect MetaMask";
                    connectButton.classList.remove("connected");
                } else {
                    // Update with new account
                    const truncatedNewAddress = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
                    connectButton.textContent = `Connected: ${truncatedNewAddress}`;
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log("Chain changed to: ", chainId);
                // Handle network change here
                window.location.reload(); // Recommended by MetaMask docs
            });

            // Auto-authorize the connected account for demo purposes
            authorizeUser(account);

        } catch (error) {
            console.error("User denied account access:", error);
            alert("Please allow access to your MetaMask account.");
        }
    } else {
        alert("MetaMask extension is not installed! Please install it to use this application.");
    }
}

// Function to authorize users (for demo purposes)
async function authorizeUser(userAddress) {
    try {
        if (contract && account) {
            await contract.methods.authorizeUser(userAddress).send({ from: account });
            console.log("User authorized:", userAddress);
        }
    } catch (error) {
        console.error("Error authorizing user:", error);
    }
}

// Register Property
async function registerProperty(event) {
    event.preventDefault();

    if (!account) {
        alert("Please connect your MetaMask wallet first!");
        return;
    }

    const propertyTitle = document.getElementById("propertyTitle").value;
    const price = document.getElementById("price").value;
    const location = document.getElementById("location").value;
    const studentDiscount = document.getElementById("studentDiscount").value || "0";
    const description = document.getElementById("description").value || "";

    if (!propertyTitle || !price || !location) {
        alert("Please fill out all required fields!");
        return;
    }

    try {
        const priceInWei = web3.utils.toWei(price, "ether");  // Convert price from EDU to Wei
        
        // Show loading state
        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = "Registering...";
        submitButton.disabled = true;
        
        await contract.methods.registerProperty(
            propertyTitle,
            priceInWei,
            location,
            true,  // For Sale
            false, // Not for Rent
            studentDiscount,
            description,
            10,    // Number of Shares
            web3.utils.toWei("0.1", "ether") // Share Price
        ).send({ from: account });

        alert("Property Registered Successfully!");
        
        // Reset form and hide modal
        document.getElementById("registerForm").reset();
        document.getElementById("propertyRegistration").classList.add("hidden");
        
        // Restore button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Optionally refresh the properties list
        loadProperties();
        
    } catch (error) {
        console.error(error);
        alert("An error occurred while registering the property.");
        
        // Restore button state on error
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.textContent = "Register Property";
        submitButton.disabled = false;
    }
}

// Function to load and display properties from the blockchain
async function loadProperties() {
    if (!contract) {
        console.log("Contract not initialized yet");
        return;
    }
    
    try {
        // Get property count from contract
        const count = await contract.methods.getPropertyCount().call();
        console.log("Total properties:", count);
        
        const propertiesGrid = document.querySelector('.properties-grid');
        propertiesGrid.innerHTML = ''; // Clear existing properties
        
        // Load properties from the blockchain
        for (let i = 1; i <= count; i++) {
            const property = await contract.methods.getPropertyDetails(i).call();
            
            // Create property card
            const propertyCard = document.createElement('div');
            propertyCard.className = 'property-card';
            propertyCard.innerHTML = `
                <div class="property-image">
                    <img src="/api/placeholder/320/200" alt="${property.title}" />
                    <span class="property-badge">Verified</span>
                </div>
                <div class="property-details">
                    <h3>${property.title}</h3>
                    <p class="property-location">${property.location}</p>
                    <div class="property-features">
                        <span>${property.description}</span>
                    </div>
                    <div class="property-price">
                        <p><strong>${web3.utils.fromWei(property.price, 'ether')}</strong> EDU</p>
                        ${property.studentDiscount > 0 ? `<p class="discount">${property.studentDiscount}% Student Discount</p>` : ''}
                    </div>
                    <button class="btn primary-btn smartContractBtn" data-id="${property.id}">Sign Smart Contract</button>
                </div>
            `;
            
            propertiesGrid.appendChild(propertyCard);
        }
        
        // Add event listeners to new smart contract buttons
        document.querySelectorAll('.smartContractBtn').forEach(button => {
            button.addEventListener('click', function() {
                const propertyId = this.getAttribute('data-id');
                executeSmartContract(propertyId);
            });
        });
        
    } catch (error) {
        console.error("Error loading properties:", error);
    }
}

// Function to execute smart contract for property rental/purchase
async function executeSmartContract(propertyId) {
    if (!account) {
        alert("Please connect your MetaMask wallet first!");
        return;
    }
    
    try {
        // Get property details
        const property = await contract.methods.getPropertyDetails(propertyId).call();
        
        // Call the contract method to purchase the property
        const result = await contract.methods.purchaseProperty(propertyId)
            .send({ 
                from: account, 
                value: property.price 
            });
        
        console.log("Transaction result:", result);
        
        // Display transaction hash
        document.getElementById('txHash').textContent = `${result.transactionHash.substring(0, 10)}...${result.transactionHash.substring(result.transactionHash.length - 8)}`;
        document.getElementById('propertyList').classList.add('hidden');
        document.getElementById('confirmation').classList.remove('hidden');
        
    } catch (error) {
        console.error("Transaction error:", error);
        alert("Transaction failed. Please try again.");
    }
}

// DOM Event Listeners

// Login Button
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('studentLogin').classList.remove('hidden');
});

// Login Form Submit
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentID = document.getElementById('studentID').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (studentID.trim() && password.trim()) {
        alert('Login successful! Welcome, Student!');
        document.getElementById('studentLogin').classList.add('hidden');
        document.getElementById('propertyList').classList.remove('hidden');
        
        // Load properties after successful login
        loadProperties();
    } else {
        alert('Please enter valid credentials.');
    }
});

// Explore Properties Button
document.getElementById('exploreBtn').addEventListener('click', function() {
    document.getElementById('propertyList').classList.remove('hidden');
    
    // Load properties when exploring
    loadProperties();
    
    // Scroll to property listings
    document.getElementById('propertyList').scrollIntoView({ behavior: 'smooth' });
});

// Register Property Button
document.getElementById('registerPropertyBtn').addEventListener('click', function() {
    if (!account) {
        alert("Please connect your MetaMask wallet first to register a property!");
        return;
    }
    document.getElementById('propertyRegistration').classList.remove('hidden');
});

// Close Transaction Confirmation
document.getElementById('closeTxBtn').addEventListener('click', function() {
    document.getElementById('confirmation').classList.add('hidden');
    document.getElementById('propertyList').classList.remove('hidden');
});

// Connect MetaMask Button
document.getElementById("connectButton").addEventListener("click", connectMetaMask);

// Property Registration Form
document.getElementById("registerForm").addEventListener("submit", registerProperty);

// Close Buttons for Modals
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.modal').classList.add('hidden');
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Initialize the app
// document.addEventListener('DOMContentLoaded', function() {
//     // Check if MetaMask is already connected
//     if (window.ethereum && window.ethereum.selectedAddress) {
//         connectMetaMask();
//     }
// });

// In the loginForm handler in script.js, add:
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentID = document.getElementById('studentID').value;
    const password = document.getElementById('password').value;
    // Assuming the student's name is entered in the login form
    const studentName = document.getElementById('studentName').value;

    // Basic validation
    if (studentID.trim() && password.trim()) {
        // Store the student name
        localStorage.setItem('studentName', studentName);
        
        // Update UI to show student name
        updateUIAfterLogin(studentName);
        
        // alert('Login successful! Welcome, ' + studentName + '!');
        document.getElementById('studentLogin').classList.add('hidden');
        document.getElementById('propertyList').classList.remove('hidden');
        
        // Load properties after successful login
        loadProperties();
    } else {
        alert('Please enter valid credentials.');
    }
});

// Add a new function to handle UI updates after login
function updateUIAfterLogin(name) {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.textContent = name;
    loginBtn.classList.add('logged-in');
    
    // Optionally change the button action when clicked after login
    loginBtn.removeEventListener('click', showLoginModal);
    loginBtn.addEventListener('click', showUserProfile);
}

// Helper functions
function showLoginModal() {
    document.getElementById('studentLogin').classList.remove('hidden');
}

function showUserProfile() {
    // You can implement a user profile view here
    alert('User profile functionality coming soon!');
}

// Make sure to define the initial event listener separately
document.getElementById('loginBtn').addEventListener('click', showLoginModal);





// Add this to your DOMContentLoaded event handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if MetaMask is already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectMetaMask();
    }
    
    // Check if student is already logged in
    const storedName = localStorage.getItem('studentName');
    if (storedName) {
        updateUIAfterLogin(storedName);
    }
});
