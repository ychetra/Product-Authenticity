// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string name;
        string ipfsHash;
        address registeredBy;
        uint256 timestamp;
    }

    mapping(string => Product) public products;
    address public owner;

    event ProductRegistered(string productId, string name, address registeredBy, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function registerProduct(string memory productId, string memory name, string memory ipfsHash) public {
        require(products[productId].registeredBy == address(0), "Product already registered");
        
        products[productId] = Product({
            name: name,
            ipfsHash: ipfsHash,
            registeredBy: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ProductRegistered(productId, name, msg.sender, block.timestamp);
    }

    function getProduct(string memory productId) public view returns (string memory, string memory, address, uint256) {
        Product memory product = products[productId];
        require(product.registeredBy != address(0), "Product not found");
        
        return (
            product.name,
            product.ipfsHash,
            product.registeredBy,
            product.timestamp
        );
    }

    function isAuthentic(string memory productId) public view returns (bool) {
        return products[productId].registeredBy != address(0);
    }
} 