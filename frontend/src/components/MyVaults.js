import React from 'react';

const MyVaults = ({ vaults, onWithdraw, loading, isConnected }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVaultStatus = (unlockDate) => {
    return Date.now() >= unlockDate ? 'unlocked' : 'locked';
  };

  const getDaysRemaining = (unlockDate) => {
    const diff = unlockDate - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (!isConnected) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Connect Your Wallet</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Please connect your wallet to view your vaults
          </p>
        </div>
      </div>
    );
  }

  if (vaults.length === 0) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>No Vaults Found</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            You haven't created any vaults yet. Create your first vault to start earning yield!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">My Vaults</h2>

      <div className="vault-list">
        {vaults.map((vault) => {
          const status = getVaultStatus(vault.unlockDate);
          const daysRemaining = getDaysRemaining(vault.unlockDate);

          return (
            <div key={vault.id} className="vault-item">
              <div className="vault-detail">
                <div className="vault-detail-label">Vault ID</div>
                <div className="vault-detail-value">#{vault.id}</div>
              </div>

              <div className="vault-detail">
                <div className="vault-detail-label">Amount</div>
                <div className="vault-detail-value">{vault.amount} STX</div>
              </div>

              <div className="vault-detail">
                <div className="vault-detail-label">Lock Period</div>
                <div className="vault-detail-value">{vault.lockPeriod} Days</div>
              </div>

              <div className="vault-detail">
                <div className="vault-detail-label">APY</div>
                <div className="vault-detail-value">{vault.apy}%</div>
              </div>

              <div className="vault-detail">
                <div className="vault-detail-label">Earned</div>
                <div className="vault-detail-value" style={{ color: '#4ade80' }}>
                  +{vault.earned} STX
                </div>
              </div>

              <div className="vault-detail">
                <div className="vault-detail-label">Status</div>
                <div className={`vault-status ${status}`}>
                  {status === 'locked' ? `🔒 ${daysRemaining} days left` : '🔓 Unlocked'}
                </div>
              </div>

              <div className="vault-detail">
                <div className="vault-detail-label">Unlock Date</div>
                <div className="vault-detail-value">{formatDate(vault.unlockDate)}</div>
              </div>

              <div className="vault-detail">
                {status === 'unlocked' ? (
                  <button
                    onClick={() => onWithdraw(vault.id)}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Emergency withdraw will incur a 10% penalty. Continue?')) {
                        onWithdraw(vault.id, true);
                      }
                    }}
                    disabled={loading}
                  >
                    Emergency Exit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyVaults;