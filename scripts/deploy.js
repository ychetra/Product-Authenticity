// Import Hardhat runtime environment
const hre = require("hardhat");

async function main() {
  console.log("Deploying ProductRegistry contract...");

  // Get the contract factory
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  
  // Deploy the contract
  const productRegistry = await ProductRegistry.deploy();
  
  // Wait for deployment to finish
  await productRegistry.waitForDeployment();
  
  // Get the contract address
  const address = await productRegistry.getAddress();
  console.log("ProductRegistry deployed to:", address);

  // Save the contract address for the frontend
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ ProductRegistry: address }, null, 2)
  );

  // Copy the contract artifact
  const artifact = await hre.artifacts.readArtifact("ProductRegistry");
  fs.writeFileSync(
    contractsDir + "/ProductRegistry.json",
    JSON.stringify(artifact, null, 2)
  );
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 