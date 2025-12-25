// reownAppKitService.js - Reown AppKit Integration for Week 3 Builder Challenge

import { WALLET_CONNECT_PROJECT_ID, APP_METADATA } from '../config/walletConfig';

/**
 * Reown AppKit Service
 * Next-generation wallet connection with enhanced features
 * Part of Week 3 Builder Challenge requirements
 */
class ReownAppKitService {
  constructor() {
    this.projectId = WALLET_CONNECT_PROJECT_ID;
    this.metadata = APP_METADATA;
    this.appKit = null;
    this.account = null;
    this.isInitialized = false;
    this.listeners = new Map();
    this.theme = 'dark';
  }

  /**
   * Initialize Reown AppKit
   */
  async initialize() {
    if (this.isInitialized) {
      return this.appKit;
    }

    try {
      console.log('🚀 Initializing Reown AppKit...');
      console.log('🆔 Project ID:', this.projectId);

      // In production, this would import the actual Reown AppKit SDK
      // For now, we create a mock implementation that tracks metrics
      this.appKit = {
        projectId: this.projectId,
        metadata: this.metadata,
        theme: this.theme,
        features: {
          email: true,
          social: true,
          walletConnect: true,
          injected: true
        },
        chains: ['stacks:testnet'],
        connected: false,
        account: null
      };

      // Initialize modal configuration
      this.configureModal();

      // Track initialization
      this.trackMetric('appkit_initialized', {
        sdk: 'reown',
        projectId: this.projectId,
        features: Object.keys(this.appKit.features),
        timestamp: Date.now()
      });

      this.isInitialized = true;
      console.log('✅ Reown AppKit initialized successfully');

      return this.appKit;
    } catch (error) {
      console.error('❌ Failed to initialize Reown AppKit:', error);
      throw error;
    }
  }

  /**
   * Configure the Reown modal
   */
  configureModal() {
    this.modalConfig = {
      theme: {
        mode: this.theme,
        variables: {
          '--w3m-color-primary': '#8A77FF',
          '--w3m-color-secondary': '#FF6B6B',
          '--w3m-border-radius': '12px'
        }
      },
      enableExplorer: true,
      enableAccountView: true,
      enableNetworkView: true,
      chains: {
        'stacks:testnet': {
          name: 'Stacks Testnet',
          icon: '⚡',
          rpc: 'https://api.testnet.hiro.so'
        }
      }
    };
  }

  /**
   * Connect wallet via Reown AppKit
   */
  async connect(method = 'modal') {
    await this.initialize();

    try {
      console.log('🔗 Connecting via Reown AppKit...');
      console.log('📱 Connection method:', method);

      // Track connection attempt
      this.trackMetric('connection_attempt', {
        sdk: 'reown',
        method,
        projectId: this.projectId
      });

      let account;

      switch (method) {
        case 'email':
          account = await this.connectViaEmail();
          break;
        case 'social':
          account = await this.connectViaSocial();
          break;
        case 'wallet':
          account = await this.connectViaWallet();
          break;
        default:
          account = await this.showModal();
      }

      // Store account
      this.account = account;
      this.appKit.connected = true;
      this.appKit.account = account;

      // Track successful connection
      this.trackMetric('connection_success', {
        sdk: 'reown',
        method,
        address: account.address,
        projectId: this.projectId
      });

      // Save session
      this.saveSession();

      console.log('✅ Reown AppKit connected');
      console.log('👤 Account:', account);

      // Emit connection event
      this.emit('connected', account);

      return account;
    } catch (error) {
      console.error('❌ Reown AppKit connection failed:', error);

      // Track connection failure
      this.trackMetric('connection_failed', {
        sdk: 'reown',
        method,
        error: error.message,
        projectId: this.projectId
      });

      throw error;
    }
  }

  /**
   * Show connection modal
   */
  async showModal() {
    console.log('🪟 Opening Reown modal...');

    // Simulate modal interaction
    await this.simulateModalInteraction();

    return {
      address: this.generateMockAddress(),
      method: 'modal',
      provider: 'reown',
      connected: true
    };
  }

  /**
   * Connect via email (Reown feature)
   */
  async connectViaEmail(email = 'user@example.com') {
    console.log('📧 Connecting via email:', email);

    // Simulate email verification
    await this.simulateEmailVerification();

    return {
      address: this.generateMockAddress(),
      email,
      method: 'email',
      provider: 'reown',
      connected: true
    };
  }

  /**
   * Connect via social login (Reown feature)
   */
  async connectViaSocial(provider = 'google') {
    console.log('🌐 Connecting via social:', provider);

    // Simulate OAuth flow
    await this.simulateOAuthFlow();

    return {
      address: this.generateMockAddress(),
      socialProvider: provider,
      method: 'social',
      provider: 'reown',
      connected: true
    };
  }

  /**
   * Connect via traditional wallet
   */
  async connectViaWallet() {
    console.log('👛 Connecting via wallet...');

    // Simulate wallet connection
    await this.simulateWalletConnection();

    return {
      address: this.generateMockAddress(),
      method: 'wallet',
      provider: 'reown',
      walletName: 'Hiro Wallet',
      connected: true
    };
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    if (!this.account) {
      return;
    }

    try {
      console.log('🔌 Disconnecting Reown AppKit...');

      // Track disconnection
      this.trackMetric('disconnection', {
        sdk: 'reown',
        address: this.account?.address,
        projectId: this.projectId
      });

      // Clear account
      this.account = null;
      this.appKit.connected = false;
      this.appKit.account = null;

      // Clear stored session
      this.clearSession();

      console.log('✅ Reown AppKit disconnected');

      // Emit disconnection event
      this.emit('disconnected', null);
    } catch (error) {
      console.error('❌ Disconnect error:', error);
      throw error;
    }
  }

  /**
   * Sign and broadcast transaction
   */
  async signTransaction(transaction) {
    if (!this.account) {
      throw new Error('No active Reown AppKit session');
    }

    try {
      console.log('✍️ Signing transaction via Reown AppKit...');

      // Track transaction
      this.trackMetric('transaction_sign_request', {
        sdk: 'reown',
        type: transaction.type,
        amount: transaction.amount,
        projectId: this.projectId
      });

      // Show transaction approval modal
      await this.showTransactionModal(transaction);

      // Simulate transaction signing
      const signedTx = {
        ...transaction,
        signature: this.generateMockSignature(),
        signedAt: Date.now(),
        signer: this.account.address
      };

      // Calculate and track fees
      const fee = 0.001; // Mock fee in STX
      this.trackFee(fee);

      // Track successful signing
      this.trackMetric('transaction_signed', {
        sdk: 'reown',
        txId: signedTx.signature.slice(0, 10),
        fee,
        projectId: this.projectId
      });

      console.log('✅ Transaction signed:', signedTx.signature);

      return signedTx;
    } catch (error) {
      console.error('❌ Transaction signing failed:', error);

      // Track signing failure
      this.trackMetric('transaction_sign_failed', {
        sdk: 'reown',
        error: error.message,
        projectId: this.projectId
      });

      throw error;
    }
  }

  /**
   * Show transaction approval modal
   */
  async showTransactionModal(transaction) {
    console.log('📋 Transaction details:');
    console.log('  Type:', transaction.type);
    console.log('  Amount:', transaction.amount, 'STX');
    console.log('  To:', transaction.to);

    // Simulate user approval
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Transaction approved by user');
        resolve();
      }, 1000);
    });
  }

  /**
   * Switch network
   */
  async switchNetwork(chainId) {
    console.log('🔄 Switching network to:', chainId);

    // Track network switch
    this.trackMetric('network_switch', {
      sdk: 'reown',
      fromChain: this.appKit.chains[0],
      toChain: chainId,
      projectId: this.projectId
    });

    this.appKit.chains = [chainId];

    console.log('✅ Network switched');
  }

  /**
   * Get current account
   */
  getAccount() {
    // Try to restore session if not connected
    if (!this.account) {
      this.restoreSession();
    }
    return this.account;
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    return this.appKit?.connected && this.account !== null;
  }

  /**
   * Get connected address
   */
  getAddress() {
    return this.account?.address || null;
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    this.theme = theme;
    if (this.appKit) {
      this.appKit.theme = theme;
      this.configureModal();
    }
  }

  /**
   * Subscribe to events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Emit events
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  /**
   * Generate mock address
   */
  generateMockAddress() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let address = 'ST';
    for (let i = 0; i < 38; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  /**
   * Generate mock signature
   */
  generateMockSignature() {
    const chars = '0123456789abcdef';
    let signature = '0x';
    for (let i = 0; i < 64; i++) {
      signature += chars[Math.floor(Math.random() * chars.length)];
    }
    return signature;
  }

  /**
   * Simulate modal interaction
   */
  simulateModalInteraction() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('👆 User selected wallet');
        resolve();
      }, 1500);
    });
  }

  /**
   * Simulate email verification
   */
  simulateEmailVerification() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✉️ Email verified');
        resolve();
      }, 2000);
    });
  }

  /**
   * Simulate OAuth flow
   */
  simulateOAuthFlow() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('🔐 OAuth authentication complete');
        resolve();
      }, 2000);
    });
  }

  /**
   * Simulate wallet connection
   */
  simulateWalletConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('👛 Wallet connected');
        resolve();
      }, 1000);
    });
  }

  /**
   * Save session to localStorage
   */
  saveSession() {
    if (this.account) {
      const session = {
        account: this.account,
        timestamp: Date.now(),
        projectId: this.projectId
      };
      localStorage.setItem('reown_session', JSON.stringify(session));
    }
  }

  /**
   * Restore session from localStorage
   */
  restoreSession() {
    try {
      const stored = localStorage.getItem('reown_session');
      if (stored) {
        const session = JSON.parse(stored);

        // Check if session is recent (within 24 hours)
        if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
          this.account = session.account;
          if (this.appKit) {
            this.appKit.connected = true;
            this.appKit.account = session.account;
          }

          console.log('🔄 Reown session restored');
          return true;
        } else {
          // Session too old, clear it
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.clearSession();
    }
    return false;
  }

  /**
   * Clear stored session
   */
  clearSession() {
    localStorage.removeItem('reown_session');
  }

  /**
   * Track metrics for leaderboard
   */
  trackMetric(eventName, data) {
    const metric = {
      event: eventName,
      timestamp: Date.now(),
      sdk: 'reown',
      projectId: this.projectId,
      ...data
    };

    // Store in localStorage for analytics
    const metrics = JSON.parse(localStorage.getItem('reown_metrics') || '[]');
    metrics.push(metric);

    // Keep only last 100 metrics
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }

    localStorage.setItem('reown_metrics', JSON.stringify(metrics));

    // Emit event for listeners
    this.emit('metric', metric);

    // Log for debugging
    console.log('📊 Reown Metric:', eventName, data);
  }

  /**
   * Track fees for leaderboard
   */
  trackFee(amount) {
    const fees = JSON.parse(localStorage.getItem('reown_fees') || '[]');
    fees.push({
      amount,
      timestamp: Date.now(),
      projectId: this.projectId
    });
    localStorage.setItem('reown_fees', JSON.stringify(fees));
  }

  /**
   * Get all tracked metrics
   */
  getMetrics() {
    return JSON.parse(localStorage.getItem('reown_metrics') || '[]');
  }

  /**
   * Get total fees generated
   */
  getTotalFees() {
    const fees = JSON.parse(localStorage.getItem('reown_fees') || '[]');
    return fees.reduce((total, fee) => total + fee.amount, 0);
  }

  /**
   * Get metrics summary for display
   */
  getMetricsSummary() {
    const metrics = this.getMetrics();

    return {
      totalConnections: metrics.filter(m => m.event === 'connection_success').length,
      totalTransactions: metrics.filter(m => m.event === 'transaction_signed').length,
      uniqueUsers: new Set(metrics.filter(m => m.address).map(m => m.address)).size,
      totalFeesGenerated: this.getTotalFees(),
      connectionMethods: {
        email: metrics.filter(m => m.method === 'email').length,
        social: metrics.filter(m => m.method === 'social').length,
        wallet: metrics.filter(m => m.method === 'wallet').length,
        modal: metrics.filter(m => m.method === 'modal').length
      },
      lastActivity: metrics.length > 0 ? metrics[metrics.length - 1].timestamp : null,
      projectId: this.projectId
    };
  }
}

// Export singleton instance
export const reownAppKit = new ReownAppKitService();

// Export class for testing
export default ReownAppKitService;