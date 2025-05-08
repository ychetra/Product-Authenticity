import React from 'react';

function ConnectWallet({ account, onConnect }) {
  const formatAccount = (account) => {
    if (!account) return '';
    return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {account ? (
            <div>
              <span style={{ fontWeight: 'bold' }}>Connected: </span>
              <span>{formatAccount(account)}</span>
            </div>
          ) : (
            <div>Not connected to wallet</div>
          )}
        </div>
        {!account && (
          <button onClick={onConnect}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default ConnectWallet; 