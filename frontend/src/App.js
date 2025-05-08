import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RegisterProduct from './components/RegisterProduct';
import VerifyProduct from './components/VerifyProduct';
import ConnectWallet from './components/ConnectWallet';
import Header from './components/Header';

// These will be populated when contract is deployed
let contractAddress, contractABI;

try {
  const contractInfo = require('./contracts/contract-address.json');
  contractAddress = contractInfo.ProductRegistry;
  contractABI = require('./contracts/ProductRegistry.json').abi;
} catch (error) {
  console.error("Contract files not found. Deploy the contract first.");
}

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState('verify');
  const [isContractLoaded, setIsContractLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Connect provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Check if contract files are available
          if (contractAddress && contractABI) {
            const contract = new ethers.Contract(
              contractAddress,
              contractABI,
              provider
            );
            setContract(contract);
            setIsContractLoaded(true);
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || '');
          });
        } catch (error) {
          console.error("Error initializing app:", error);
        }
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        return true;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return false;
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
      return false;
    }
  };

  const getSigner = async () => {
    if (!provider) return null;
    return await provider.getSigner();
  };

  // Function to get a write contract (with signer)
  const getWriteContract = async () => {
    if (!contract) return null;
    const signer = await getSigner();
    return contract.connect(signer);
  };

  return (
    <div className="container">
      <Header />
      
      <ConnectWallet 
        account={account} 
        onConnect={connectWallet} 
      />

      {isContractLoaded ? (
        <>
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
              onClick={() => setActiveTab('verify')}
            >
              Verify Product
            </div>
            <div 
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register Product
            </div>
          </div>

          {activeTab === 'verify' ? (
            <VerifyProduct 
              contract={contract} 
            />
          ) : (
            <RegisterProduct 
              getWriteContract={getWriteContract}
              account={account}
              connectWallet={connectWallet}
            />
          )}
        </>
      ) : (
        <div className="card">
          <div className="status status-warning">
            <p>Smart contract not detected. Please make sure the contract is deployed and you are connected to the correct network.</p>
          </div>
          <p>Follow these steps:</p>
          <ol>
            <li>Deploy the ProductRegistry contract using Hardhat</li>
            <li>Make sure the contract address is available in src/contracts/contract-address.json</li>
            <li>Make sure the contract ABI is available in src/contracts/ProductRegistry.json</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default App; 