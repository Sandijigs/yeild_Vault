/**
 * Wallet Configuration for Week 3 Builder Challenge
 * Integrates WalletKit SDK and Reown AppKit
 */

// WalletConnect Project ID (provided)
export const WALLET_CONNECT_PROJECT_ID = '973aec75d9c96397c8ccd94d62bada81';

// Contract Configuration (Updated December 27, 2025)
export const CONTRACT_CONFIG = {
  address: 'SP1WPQWDNG2H8VMG93PW3JM74SGXVTA38EVCH7GYS',
  name: 'yield-vault',
  network: 'testnet',
  deploymentTx: 'e2dc0bef28af16ab3f9563266b1107be7befae503efffaa4d55bf9fabdceaa70',
  fullId: 'SP1WPQWDNG2H8VMG93PW3JM74SGXVTA38EVCH7GYS.yield-vault'
};

// App metadata
export const APP_METADATA = {
  name: 'Yield Vault DeFi',
  description: 'Time-Locked Yield Vault Protocol on Stacks',
  url: 'https://yield-vault.stacks.app',
  icons: ['https://yield-vault.stacks.app/logo.png']
};

// Chain configuration for Stacks
export const STACKS_TESTNET = {
  id: 'stacks:testnet',
  name: 'Stacks Testnet',
  network: 'testnet',
  rpcUrl: 'https://api.testnet.hiro.so',
  explorerUrl: 'https://explorer.hiro.so/?chain=testnet'
};

export const STACKS_MAINNET = {
  id: 'stacks:mainnet',
  name: 'Stacks Mainnet',
  network: 'mainnet',
  rpcUrl: 'https://api.hiro.so',
  explorerUrl: 'https://explorer.hiro.so'
};

// WalletKit configuration
export const walletKitConfig = {
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: APP_METADATA,
  chains: [STACKS_TESTNET],
  enableExplorer: true,
  explorerRecommendedWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
  ],
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#5546ff',
    '--w3m-color-mix-strength': 40,
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-border-radius-master': '12px',
    '--w3m-accent': '#5546ff'
  }
};

// Reown AppKit configuration
export const reownAppKitConfig = {
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [STACKS_TESTNET],
  providers: [],
  metadata: {
    ...APP_METADATA,
    verifyUrl: 'https://verify.walletconnect.com'
  },
  appearance: {
    theme: 'dark',
    accentColor: '#5546ff',
    borderRadius: 'medium',
    logo: '/logo.png'
  },
  features: {
    analytics: true,
    email: false, // Can be enabled for email wallet
    socials: ['google', 'github', 'discord'],
    emailShowWallets: true
  }
};

// Supported wallets
export const SUPPORTED_WALLETS = {
  HIRO: {
    name: 'Hiro Wallet',
    icon: '/wallets/hiro.svg',
    downloadUrl: 'https://wallet.hiro.so/',
    deepLink: 'hiro://',
    chromeWebStore: 'https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj'
  },
  XVERSE: {
    name: 'Xverse',
    icon: '/wallets/xverse.svg',
    downloadUrl: 'https://www.xverse.app/',
    deepLink: 'xverse://',
    chromeWebStore: 'https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg'
  },
  LEATHER: {
    name: 'Leather',
    icon: '/wallets/leather.svg',
    downloadUrl: 'https://leather.io/',
    deepLink: 'leather://',
    chromeWebStore: 'https://chrome.google.com/webstore/detail/leather/ldinpeekobnhjjdofggfgjlcehhmanlj'
  },
  OKX: {
    name: 'OKX Wallet',
    icon: '/wallets/okx.svg',
    downloadUrl: 'https://www.okx.com/web3',
    deepLink: 'okx://wallet',
    universalLink: 'https://www.okx.com/download'
  }
};

// Analytics tracking for leaderboard
export const trackWalletEvent = (eventName, eventData = {}) => {
  // Track events for Week 3 Builder Challenge
  const event = {
    event: eventName,
    timestamp: Date.now(),
    projectId: WALLET_CONNECT_PROJECT_ID,
    ...eventData
  };

  // Send to analytics endpoint
  if (window.analytics) {
    window.analytics.track(eventName, event);
  }

  // Log for debugging
  console.log('Wallet Event:', event);

  // Store locally for metrics
  const events = JSON.parse(localStorage.getItem('wallet_events') || '[]');
  events.push(event);
  localStorage.setItem('wallet_events', JSON.stringify(events));
};

// Helper to check if wallet is installed
export const isWalletInstalled = (walletName) => {
  switch (walletName) {
    case 'HIRO':
      return typeof window.HiroWalletProvider !== 'undefined';
    case 'XVERSE':
      return typeof window.XverseProviders !== 'undefined';
    case 'LEATHER':
      return typeof window.LeatherProvider !== 'undefined';
    case 'OKX':
      return typeof window.okxwallet !== 'undefined';
    default:
      return false;
  }
};

// Export metrics for leaderboard
export const getWalletMetrics = () => {
  const events = JSON.parse(localStorage.getItem('wallet_events') || '[]');

  return {
    totalConnections: events.filter(e => e.event === 'wallet_connected').length,
    uniqueWallets: [...new Set(events.map(e => e.wallet))].length,
    totalTransactions: events.filter(e => e.event === 'transaction_submitted').length,
    walletKitUsage: events.filter(e => e.sdk === 'walletkit').length,
    reownAppKitUsage: events.filter(e => e.sdk === 'reown').length,
    lastActivity: events[events.length - 1]?.timestamp || null
  };
};