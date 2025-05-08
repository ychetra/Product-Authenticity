const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductRegistry", function () {
  let productRegistry;
  let owner;
  let manufacturer;
  let consumer;

  beforeEach(async function () {
    [owner, manufacturer, consumer] = await ethers.getSigners();
    
    const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
    productRegistry = await ProductRegistry.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await productRegistry.owner()).to.equal(owner.address);
    });
  });

  describe("Product Registration", function () {
    it("Should register a new product", async function () {
      const productId = "PROD123";
      const productName = "Test Product";
      const ipfsHash = "QmTest123";

      await productRegistry.connect(manufacturer).registerProduct(productId, productName, ipfsHash);
      
      const product = await productRegistry.products(productId);
      expect(product.name).to.equal(productName);
      expect(product.ipfsHash).to.equal(ipfsHash);
      expect(product.registeredBy).to.equal(manufacturer.address);
    });

    it("Should fail to register the same product twice", async function () {
      const productId = "PROD123";
      const productName = "Test Product";
      const ipfsHash = "QmTest123";

      await productRegistry.connect(manufacturer).registerProduct(productId, productName, ipfsHash);
      
      await expect(
        productRegistry.connect(manufacturer).registerProduct(productId, productName, ipfsHash)
      ).to.be.revertedWith("Product already registered");
    });

    it("Should verify a product is authentic", async function () {
      const productId = "PROD123";
      const productName = "Test Product";
      const ipfsHash = "QmTest123";

      await productRegistry.connect(manufacturer).registerProduct(productId, productName, ipfsHash);
      
      expect(await productRegistry.isAuthentic(productId)).to.equal(true);
      expect(await productRegistry.isAuthentic("FAKE123")).to.equal(false);
    });

    it("Should get product details", async function () {
      const productId = "PROD123";
      const productName = "Test Product";
      const ipfsHash = "QmTest123";

      await productRegistry.connect(manufacturer).registerProduct(productId, productName, ipfsHash);
      
      const [name, hash, registrar, timestamp] = await productRegistry.getProduct(productId);
      expect(name).to.equal(productName);
      expect(hash).to.equal(ipfsHash);
      expect(registrar).to.equal(manufacturer.address);
      expect(timestamp).to.not.equal(0);
    });
  });
}); 