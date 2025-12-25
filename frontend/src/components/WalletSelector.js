import React from 'react';
import './WalletSelector.css';

const WalletSelector = ({ onClose, onConnect }) => {
  const handleWalletSelect = (walletType) => {
    onConnect(walletType);
    onClose();
  };

  return (
    <div className="wallet-selector-overlay" onClick={onClose}>
      <div className="wallet-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-selector-header">
          <h2>Connect Wallet</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="wallet-selector-content">
          <div className="week3-banner">
            <span className="banner-badge">🏆 Week 3 Challenge</span>
            <p>WalletKit SDK & Reown AppKit Integration</p>
          </div>

          <div className="wallet-options">
            <h3>Recommended Wallets</h3>

            <button className="wallet-option" onClick={() => handleWalletSelect('hiro')}>
              <div className="wallet-icon">
                <svg width="40" height="40">
                  <use href="/wallet-icons.svg#hiro-wallet" />
                </svg>
              </div>
              <div className="wallet-info">
                <div className="wallet-name">Hiro Wallet</div>
                <div className="wallet-description">The most popular Stacks wallet</div>
              </div>
              <div className="wallet-badge recommended">Recommended</div>
            </button>

            <button className="wallet-option" onClick={() => handleWalletSelect('xverse')}>
              <div className="wallet-icon">
                <svg width="40" height="40">
                  <use href="/wallet-icons.svg#xverse-wallet" />
                </svg>
              </div>
              <div className="wallet-info">
                <div className="wallet-name">Xverse</div>
                <div className="wallet-description">Bitcoin & Stacks wallet</div>
              </div>
            </button>

            <button className="wallet-option" onClick={() => handleWalletSelect('leather')}>
              <div className="wallet-icon">
                <svg width="40" height="40">
                  <use href="/wallet-icons.svg#leather-wallet" />
                </svg>
              </div>
              <div className="wallet-info">
                <div className="wallet-name">Leather</div>
                <div className="wallet-description">Previously Hiro Wallet</div>
              </div>
            </button>

            <h3 style={{ marginTop: '2rem' }}>Advanced Connection Methods</h3>

            <button className="wallet-option advanced" onClick={() => handleWalletSelect('walletkit')}>
              <div className="wallet-icon">
                <svg width="40" height="40">
                  <use href="/wallet-icons.svg#walletkit-sdk" />
                </svg>
              </div>
              <div className="wallet-info">
                <div className="wallet-name">WalletKit SDK</div>
                <div className="wallet-description">Connect via WalletConnect protocol</div>
              </div>
              <div className="wallet-badge new">NEW</div>
            </button>

            <button className="wallet-option advanced" onClick={() => handleWalletSelect('reown')}>
              <div className="wallet-icon">
                <svg width="40" height="40">
                  <use href="/wallet-icons.svg#reown-appkit" />
                </svg>
              </div>
              <div className="wallet-info">
                <div className="wallet-name">Reown AppKit</div>
                <div className="wallet-description">Next-gen wallet connection</div>
              </div>
              <div className="wallet-badge new">NEW</div>
            </button>
          </div>

          <div className="wallet-selector-footer">
            <p className="project-id">
              WalletConnect Project ID: 973aec75d9c96397c8ccd94d62bada81
            </p>
            <p className="learn-more">
              <a href="https://docs.stacks.co/connect" target="_blank" rel="noopener noreferrer">
                Learn more about wallet connections →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSelector;