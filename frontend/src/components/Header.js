import React from 'react';
import './Header.css';

const Header = ({ userData, onConnect, onDisconnect, isConnecting }) => {
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substr(0, 6)}...${address.substr(-4)}`;
  };

  const getAddress = () => {
    if (!userData) return '';
    return userData.profile?.stxAddress?.testnet || '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏦</span>
            <span className="logo-text">Yield Vault</span>
          </div>

          <nav className="nav-menu">
            <a href="#dashboard" className="nav-link">Dashboard</a>
            <a href="#vaults" className="nav-link">Vaults</a>
            <a href="#docs" className="nav-link">Docs</a>
          </nav>

          <div className="wallet-section">
            {userData ? (
              <div className="wallet-connected">
                <div className="wallet-info">
                  <span className="wallet-status-dot"></span>
                  <span className="wallet-address">
                    {formatAddress(getAddress())}
                  </span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="btn btn-secondary disconnect-btn"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="btn btn-primary connect-btn"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;