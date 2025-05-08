import React, { useState } from 'react';

function VerifyProduct({ contract }) {
  const [productId, setProductId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [productDetails, setProductDetails] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Reset status and product details
    setStatus({ type: '', message: '' });
    setProductDetails(null);
    
    if (!productId) {
      setStatus({ type: 'error', message: 'Please enter a Product ID' });
      return;
    }

    try {
      setIsVerifying(true);
      
      // First check if the product is authentic
      const isAuthentic = await contract.isAuthentic(productId);
      
      if (!isAuthentic) {
        setStatus({ 
          type: 'error', 
          message: `Product with ID ${productId} is not registered in the blockchain. This product may not be authentic.` 
        });
        return;
      }
      
      // Get the product details
      const [name, ipfsHash, registeredBy, timestamp] = await contract.getProduct(productId);
      
      // Convert timestamp to human-readable date
      const date = new Date(Number(timestamp) * 1000);
      
      setProductDetails({
        name,
        ipfsHash,
        registeredBy,
        date: date.toLocaleString()
      });
      
      setStatus({ 
        type: 'success', 
        message: `Product verified! This product is registered on the blockchain.` 
      });
      
    } catch (error) {
      console.error("Error verifying product:", error);
      setStatus({ 
        type: 'error', 
        message: `Error verifying product: ${error.message}` 
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="card">
      <h2>Verify Product Authenticity</h2>
      
      {status.message && (
        <div className={`status ${status.type ? `status-${status.type}` : ''}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="verifyProductId">Product ID</label>
          <input 
            type="text" 
            id="verifyProductId"
            placeholder="Enter the Product ID to verify" 
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isVerifying || !productId}
        >
          {isVerifying ? 'Verifying...' : 'Verify Product'}
        </button>
      </form>
      
      {productDetails && (
        <div className="product-details" style={{ marginTop: '2rem' }}>
          <h3>Product Details</h3>
          <p><strong>Name:</strong> {productDetails.name}</p>
          <p><strong>Registered By:</strong> {productDetails.registeredBy}</p>
          <p><strong>Registration Date:</strong> {productDetails.date}</p>
          {productDetails.ipfsHash && (
            <p>
              <strong>IPFS Hash:</strong> {productDetails.ipfsHash}
              {productDetails.ipfsHash.startsWith('Qm') && (
                <span>
                  <br />
                  <a 
                    href={`https://ipfs.io/ipfs/${productDetails.ipfsHash}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '0.5rem' }}
                  >
                    View on IPFS
                  </a>
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyProduct;