# 🏦 Yield Vault Frontend

A modern React-based DeFi application for the Yield Vault smart contract on Stacks, featuring seamless wallet integration and a beautiful UI.

## 🚀 Features

- ✅ **Stacks Connect Integration** - Native wallet connection
- ✅ **Real-time TVL Tracking** - Live protocol statistics
- ✅ **Vault Management** - Create, view, and withdraw vaults
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Dark Mode UI** - Modern, eye-friendly interface
- ✅ **Contract Interaction** - Direct smart contract calls

## 📋 Prerequisites

- Node.js 16+ and npm
- A Stacks wallet (Hiro Wallet, Xverse, etc.)
- Testnet STX for transactions

## 🛠 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## 🔧 Configuration

The app is configured to connect to the deployed contract on testnet:

```javascript
CONTRACT_ADDRESS = 'ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ'
CONTRACT_NAME = 'yield-vault'
NETWORK = 'testnet'
```

## 🎨 Project Structure

```
frontend/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Header.js       # Navigation and wallet connection
│   │   ├── CreateVault.js  # Vault creation form
│   │   ├── MyVaults.js     # User vault management
│   │   ├── Stats.js        # Protocol statistics
│   │   └── VaultDashboard.js # Dashboard overview
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   └── index.js            # App entry point
└── package.json            # Dependencies
```

## 💻 Usage

### Connecting Wallet

1. Click "Connect Wallet" in the header
2. Select your Stacks wallet
3. Approve the connection request
4. Your address will appear in the header

### Creating a Vault

1. Navigate to "Create Vault" tab
2. Select lock period (30, 90, 180, or 365 days)
3. Enter deposit amount (minimum 1 STX)
4. Review expected returns
5. Click "Create Vault"
6. Confirm transaction in wallet

### Managing Vaults

1. Go to "My Vaults" tab
2. View all your active vaults
3. Check lock status and remaining time
4. Withdraw unlocked vaults
5. Emergency withdraw (with 10% penalty)

## 🔌 Wallet Integration

The app uses `@stacks/connect` for wallet integration:

```javascript
import { showConnect } from '@stacks/connect';

showConnect({
  appDetails: {
    name: 'Yield Vault',
    icon: window.location.origin + '/logo.png',
  },
  redirectTo: '/',
  onFinish: () => {
    window.location.reload();
  },
  userSession,
});
```

## 📡 Contract Interaction

Example of calling contract functions:

```javascript
// Read-only function
const tvlResult = await callReadOnlyFunction({
  network: NETWORK,
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'get-tvl',
  functionArgs: [],
  senderAddress: CONTRACT_ADDRESS,
});

// Public function (requires wallet)
const options = {
  network: NETWORK,
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'deposit',
  functionArgs: [
    uintCV(amount * 1000000),
    uintCV(lockPeriod),
    uintCV(poolId)
  ],
  onFinish: (data) => {
    console.log('Transaction:', data.txId);
  },
};

await showConnect(options);
```

## 🎯 Week 3 Challenge Integration

For the Builder Challenge Week 3, additional integrations are planned:

### WalletKit SDK
```javascript
// Coming soon
import { WalletKit } from '@walletkit/sdk';
```

### Reown AppKit
```javascript
// Coming soon
import { ReownAppKit } from '@reown/appkit';
```

## 🚦 Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 📊 Environment Variables

Create a `.env` file for custom configuration:

```env
REACT_APP_NETWORK=testnet
REACT_APP_CONTRACT_ADDRESS=ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ
REACT_APP_CONTRACT_NAME=yield-vault
```

## 🐛 Troubleshooting

### Wallet not connecting
- Ensure you have a Stacks wallet installed
- Check that you're on the correct network (testnet)
- Clear browser cache and retry

### Transactions failing
- Verify you have enough STX for gas fees
- Check that the contract is deployed
- Ensure correct function parameters

### Build issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Update npm: `npm update`
- Check Node.js version: `node --version` (should be 16+)

## 🔗 Resources

- [Stacks.js Documentation](https://github.com/hirosystems/stacks.js)
- [Hiro Wallet](https://wallet.hiro.so/)
- [Stacks Explorer](https://explorer.hiro.so/)
- [Contract on Testnet](https://explorer.hiro.so/txid/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043?chain=testnet)

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for the Stacks ecosystem