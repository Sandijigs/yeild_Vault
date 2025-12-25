import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import {
  WALLET_CONNECT_PROJECT_ID,
  trackWalletEvent,
  SUPPORTED_WALLETS
} from '../config/walletConfig';

// Create wallet context
const WalletContext = createContext({});

// App configuration for Stacks
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const network = new StacksTestnet();

// WalletProvider component
export const WalletProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState(null);
  const [metrics, setMetrics] = useState({
    connections: 0,
    transactions: 0,
    feesGenerated: 0
  });

  // Initialize on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Check for existing session
  const checkExistingSession = () => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
        trackWalletEvent('session_restored', {
          wallet: 'stacks',
          address: userData.profile?.stxAddress?.testnet
        });
      });
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserData(userData);
    }
  };

  // Connect with Stacks Connect (default)
  const connectWallet = useCallback(() => {
    setIsConnecting(true);
    setConnectionMethod('stacks');

    showConnect({
      appDetails: {
        name: 'Yield Vault',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        setIsConnecting(false);
        const userData = userSession.loadUserData();
        setUserData(userData);

        // Track connection for leaderboard
        trackWalletEvent('wallet_connected', {
          sdk: 'stacks',
          wallet: 'hiro',
          address: userData.profile?.stxAddress?.testnet,
          projectId: WALLET_CONNECT_PROJECT_ID
        });

        // Update metrics
        setMetrics(prev => ({
          ...prev,
          connections: prev.connections + 1
        }));

        window.location.reload();
      },
      onCancel: () => {
        setIsConnecting(false);
        trackWalletEvent('connection_cancelled', { sdk: 'stacks' });
      },
      userSession,
    });
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setUserData(null);
    setConnectionMethod(null);

    trackWalletEvent('wallet_disconnected', {
      sdk: connectionMethod,
      projectId: WALLET_CONNECT_PROJECT_ID
    });

    window.location.reload();
  }, [connectionMethod]);

  // Get wallet address
  const getAddress = useCallback(() => {
    if (!userData) return null;
    return userData.profile?.stxAddress?.testnet || null;
  }, [userData]);

  // Track transaction
  const trackTransaction = useCallback((txId, type, amount) => {
    trackWalletEvent('transaction_submitted', {
      sdk: connectionMethod,
      txId,
      type,
      amount,
      projectId: WALLET_CONNECT_PROJECT_ID
    });

    setMetrics(prev => ({
      ...prev,
      transactions: prev.transactions + 1,
      feesGenerated: prev.feesGenerated + 0.001 // Estimated fee
    }));
  }, [connectionMethod]);

  // Context value
  const value = {
    userData,
    isConnecting,
    connectionMethod,
    metrics,
    network,
    connectWallet,
    disconnect,
    getAddress,
    trackTransaction,
    userSession,
    WALLET_CONNECT_PROJECT_ID,
    SUPPORTED_WALLETS
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export default WalletProvider;