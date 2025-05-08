import React, { useState } from 'react';

function RegisterProduct({ getWriteContract, account, connectWallet }) {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Reset status
    setStatus({ type: '', message: '' });
    
    if (!productId || !productName) {
      setStatus({ 
        type: 'error', 
        message: 'Product ID and Name are required' 
      });
      return;
    }

    // If no account is connected, try to connect first
    if (!account) {
      const connected = await connectWallet();
      if (!connected) {
        setStatus({ 
          type: 'error', 
          message: 'Please connect your wallet first' 
        });
        return;
      }
    }

    try {
      setIsRegistering(true);
      
      const writeContract = await getWriteContract();
      if (!writeContract) {
        throw new Error("Failed to get contract with signer");
      }

      // Register the product
      const tx = await writeContract.registerProduct(productId, productName, ipfsHash || '');
      
      setStatus({ 
        type: 'info', 
        message: 'Transaction submitted. Waiting for confirmation...' 
      });
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      setStatus({ 
        type: 'success', 
        message: `Product registered successfully! Transaction hash: ${tx.hash}` 
      });
      
      // Reset form
      setProductId('');
      setProductName('');
      setIpfsHash('');
      
    } catch (error) {
      console.error("Error registering product:", error);
      setStatus({ 
        type: 'error', 
        message: `Failed to register product: ${error.message}` 
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="card">
      <h2>Register New Product</h2>
      
      {status.message && (
        <div className={`status ${status.type ? `status-${status.type}` : ''}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="productId">Product ID *</label>
          <input 
            type="text" 
            id="productId"
            placeholder="Unique Product ID (e.g., SKU-12345)" 
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="productName">Product Name *</label>
          <input 
            type="text" 
            id="productName"
            placeholder="Name of the product" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ipfsHash">IPFS Hash (Optional)</label>
          <input 
            type="text" 
            id="ipfsHash"
            placeholder="IPFS hash for product metadata (optional)" 
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
          />
          <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
            You can upload product images or metadata to IPFS and provide the hash here
          </small>
        </div>
        
        <button 
          type="submit" 
          disabled={isRegistering || !productId || !productName}
        >
          {isRegistering ? 'Registering...' : 'Register Product'}
        </button>
      </form>
    </div>
  );
}

export default RegisterProduct; 