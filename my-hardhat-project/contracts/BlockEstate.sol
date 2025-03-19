// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockEstate {
    // Structure for a Property
    struct Property {
        uint id;
        address owner;
        string title;       // Added title field
        uint price;
        string location;
        bool isForSale;
        bool isForRent;
        uint studentDiscount; // Added student discount field
        string description;   // Added description field
        uint shares;      // Number of shares for fractional ownership
        uint sharePrice;  // Price per share
    }

    // Mapping of property IDs to property details
    mapping(uint => Property) public properties;
    uint public propertyCount;

    // Mapping to track fractional ownership of properties
    mapping(uint => mapping(address => uint)) public propertyShares;  // propertyId -> (ownerAddress -> number of shares)

    // Mapping to track registered users (can be expanded later with roles/tokens)
    mapping(address => bool) public authorizedUsers;

    // Event when a property is registered
    event PropertyRegistered(uint propertyId, address owner, string title, uint price, string location);

    // Event when a rental agreement is created
    event RentalAgreementCreated(uint propertyId, address tenant, uint price);

    // Event when a share is bought for a property
    event ShareBought(uint propertyId, address buyer, uint shareAmount);

    // Modifier to check if the sender is the property owner
    modifier onlyOwner(uint propertyId) {
        require(properties[propertyId].owner == msg.sender, "Only the property owner can perform this action");
        _;
    }

    // Modifier to check if the property is for sale
    modifier forSale(uint propertyId) {
        require(properties[propertyId].isForSale, "This property is not for sale");
        _;
    }

    // Modifier to check if the property is for rent
    modifier forRent(uint propertyId) {
        require(properties[propertyId].isForRent, "This property is not available for rent");
        _;
    }

    // Constructor - all users are authorized by default for simplicity in this demo
    constructor() {
        authorizedUsers[msg.sender] = true;  // The deployer is authorized by default
    }

    // Function to authorize a user
    function authorizeUser(address user) public {
        // For demonstration purposes, anyone can be authorized
        // In a production environment, this should be restricted
        authorizedUsers[user] = true;
    }

    // Function to register a property for sale or rent
    function registerProperty(
        string memory title,
        uint price,
        string memory location,
        bool isForSale,
        bool isForRent,
        uint studentDiscount,
        string memory description,
        uint shares,
        uint sharePrice
    ) public {
        // For demonstration purposes, all users are authorized
        // In production, use the onlyAuthorized modifier
        propertyCount++;
        properties[propertyCount] = Property({
            id: propertyCount,
            owner: msg.sender,
            title: title,
            price: price,
            location: location,
            isForSale: isForSale,
            isForRent: isForRent,
            studentDiscount: studentDiscount,
            description: description,
            shares: shares,
            sharePrice: sharePrice
        });

        emit PropertyRegistered(propertyCount, msg.sender, title, price, location);
    }

    // Function to purchase a property
    function purchaseProperty(uint propertyId) public payable forSale(propertyId) {
        Property storage property = properties[propertyId];
        
        // Check if enough money is paid
        require(msg.value >= property.price, "Insufficient payment");

        // Transfer payment to property owner with error handling
        (bool success, ) = payable(property.owner).call{value: msg.value}("");
        require(success, "Payment transfer failed");

        // Transfer ownership
        property.owner = msg.sender;
        property.isForSale = false; // No longer for sale
        
        // Any excess payment should be returned
        if (msg.value > property.price) {
            uint excess = msg.value - property.price;
            (success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "Refund transfer failed");
        }
    }

    // Function to get all property count
    function getPropertyCount() public view returns (uint) {
        return propertyCount;
    }

    // Function to get property details
    function getPropertyDetails(uint propertyId) public view returns (
        uint id,
        address owner,
        string memory title,
        uint price,
        string memory location,
        bool isForSale,
        bool isForRent,
        uint studentDiscount,
        string memory description,
        uint shares,
        uint sharePrice
    ) {
        Property storage property = properties[propertyId];
        return (
            property.id,
            property.owner,
            property.title,
            property.price,
            property.location,
            property.isForSale,
            property.isForRent,
            property.studentDiscount,
            property.description,
            property.shares,
            property.sharePrice
        );
    }

    // Receive function to handle unexpected calls or transfers of Ether
    receive() external payable {
        // Accept Ether transfers for simplicity in this demo
    }

    // Fallback function to handle unexpected calls
    fallback() external payable {
        // Accept fallback calls for simplicity in this demo
    }
}
