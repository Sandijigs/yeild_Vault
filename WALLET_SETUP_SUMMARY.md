# 🔐 Stacks Wallet Generation & Deployment - Complete Setup

## 📋 Summary

This guide provides everything needed to generate Stacks wallet addresses and deploy the yield-vault smart contract following best practices.

## ✅ What's Included

### 1. Wallet Generation Tools

| File | Purpose |
|------|---------|
| `scripts/generate-wallet.sh` | Interactive wallet generation script |
| `WALLET_GENERATION_GUIDE.md` | Comprehensive wallet generation documentation |

### 2. Deployment Configuration

| File | Purpose |
|------|---------|
| `settings/Testnet.toml` | Testnet deployment configuration template |
| `settings/Simnet.toml` | Local testing configuration |
| `settings/Devnet.toml` | Development network configuration |

### 3. Documentation

| File | Purpose |
|------|---------|
| `DEPLOYMENT.md` | Full deployment guide with troubleshooting |
| `QUICK_START.md` | 5-minute testnet deployment guide |
| `README.md` | Contract documentation |

### 4. Security

| Feature | Status |
|---------|--------|
| `.gitignore` updated | ✅ Protects wallet files |
| Wallet file patterns ignored | ✅ `*wallet*.json`, `*keychain*.json` |
| Deployment configs ignored | ✅ `Testnet.toml`, `Mainnet.toml` |
| Deployment plans ignored | ✅ `*.yaml`, `*.plan.yaml` |

## 🚀 Quick Start Commands

### Install Stacks CLI
```bash
npm install -g @stacks/cli
```

### Generate Testnet Wallet
```bash
cd yield-vault
./scripts/generate-wallet.sh
# Select: 1 (Testnet)
```

**Or manually:**
```bash
stx make_keychain -t > testnet_wallet.json
cat testnet_wallet.json
```

### Get Testnet STX
```bash
# Visit with your ST address:
open https://explorer.hiro.so/sandbox/faucet?chain=testnet
```

### Deploy to Testnet
```bash
# 1. Update settings/Testnet.toml with your mnemonic
# 2. Generate deployment
clarinet deployments generate --testnet

# 3. Deploy
clarinet deployments apply --testnet
```

## 📊 Wallet Address Formats

| Network | Prefix | Example |
|---------|--------|---------|
| Testnet | `ST` | ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG |
| Mainnet | `SP` | SP2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG |
| Contract | `.contract-name` | ST...AG.yield-vault |

## 🔑 Generated Wallet Information

When you run `stx make_keychain -t`, you get:

```json
{
  "mnemonic": "word1 word2 ... word24",
  "keyInfo": {
    "privateKey": "your-private-key-hex",
    "address": "ST...",  // Your Stacks address
    "btcAddress": "tb...",  // Bitcoin testnet address
    "wif": "...",
    "index": 0
  }
}
```

### What to Save
- ✅ **Mnemonic** - Backup securely offline
- ✅ **Address** - For receiving STX
- ❌ **Private Key** - Never share or commit!

## 🛡️ Security Best Practices

### DO ✅
1. Generate unique wallets for testnet and mainnet
2. Backup mnemonics offline (paper, encrypted USB)
3. Use environment variables for production
4. Test thoroughly on testnet first
5. Keep wallet files in `.gitignore`
6. Use `clarinet deployments encrypt` for production

### DON'T ❌
1. Never commit wallet files or mnemonics to git
2. Never share private keys or mnemonics
3. Never reuse production mnemonics for testing
4. Never store mnemonics in plain text online
5. Never skip testnet testing
6. Never deploy to mainnet without audits

## 📁 Project Structure

```
yield-vault/
├── contracts/
│   └── yield-vault.clar          # Smart contract (Clarity 4, epoch 3.3)
├── tests/
│   └── yield-vault_test.ts       # 8 comprehensive tests
├── settings/
│   ├── Simnet.toml               # Local testing config
│   ├── Devnet.toml               # Development config
│   └── Testnet.toml              # Testnet config (gitignored)
├── deployments/
│   └── .gitkeep                  # Deployment plans (gitignored)
├── scripts/
│   └── generate-wallet.sh        # Wallet generation script
├── .gitignore                    # Security: ignores wallet files
├── Clarinet.toml                 # Clarity 4, epoch 3.3
├── README.md                     # Contract documentation
├── DEPLOYMENT.md                 # Full deployment guide
├── WALLET_GENERATION_GUIDE.md    # Wallet generation docs
├── QUICK_START.md                # 5-minute guide
└── WALLET_SETUP_SUMMARY.md       # This file
```

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Stacks CLI installed (`npm install -g @stacks/cli`)
- [ ] Wallet generated (testnet or mainnet)
- [ ] Wallet funded with STX
- [ ] Mnemonic backed up securely
- [ ] `settings/Testnet.toml` updated with mnemonic
- [ ] Contract tested on simnet (`clarinet console`)

### Testnet Deployment
- [ ] Generate deployment plan (`clarinet deployments generate --testnet`)
- [ ] Review deployment plan
- [ ] Check deployment (`clarinet deployments check --testnet`)
- [ ] Deploy (`clarinet deployments apply --testnet`)
- [ ] Verify on explorer
- [ ] Create initial pool
- [ ] Test all functions

### Mainnet Deployment (When Ready)
- [ ] Complete testnet testing
- [ ] Security audit completed
- [ ] Mainnet wallet generated
- [ ] Mainnet wallet funded (500+ STX recommended)
- [ ] `settings/Mainnet.toml` created
- [ ] Final review and approval
- [ ] Generate mainnet deployment plan
- [ ] Deploy to mainnet
- [ ] Verify deployment
- [ ] Monitor contract activity

## 💰 Cost Estimates

### Testnet
- **Contract Deployment**: ~0.5 STX (free from faucet)
- **Pool Creation**: ~0.1 STX
- **Testing**: ~0.5 STX
- **Total Needed**: 1-2 STX (free from faucet)

### Mainnet
- **Contract Deployment**: 50-200 STX (varies)
- **Pool Creation**: 10-50 STX
- **Buffer**: 2-3x for safety
- **Recommended Wallet Balance**: 500 STX

## 🔗 Essential Links

| Resource | URL |
|----------|-----|
| Testnet Faucet | https://explorer.hiro.so/sandbox/faucet?chain=testnet |
| Testnet Explorer | https://explorer.hiro.so/?chain=testnet |
| Mainnet Explorer | https://explorer.hiro.so/ |
| Hiro Wallet | https://wallet.hiro.so/ |
| Stacks Docs | https://docs.stacks.co/ |
| @stacks/cli | https://www.npmjs.com/package/@stacks/cli |
| Clarinet Docs | https://github.com/hirosystems/clarinet |

## 📖 Documentation Navigation

### For First-Time Users
1. Start with: [QUICK_START.md](QUICK_START.md)
2. Then read: [WALLET_GENERATION_GUIDE.md](WALLET_GENERATION_GUIDE.md)
3. Deploy using: [DEPLOYMENT.md](DEPLOYMENT.md)

### For Experienced Users
1. Generate wallet: `./scripts/generate-wallet.sh`
2. Deploy: `clarinet deployments apply --testnet`
3. Reference: [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting

## 🆘 Troubleshooting

### "stx: command not found"
```bash
npm install -g @stacks/cli
```

### "Insufficient balance"
- Testnet: Visit faucet and wait 5-10 minutes
- Mainnet: Purchase and transfer more STX

### "Invalid mnemonic"
- Check for typos in `settings/Testnet.toml`
- Ensure 24 words, space-separated
- No extra quotes or special characters

### "Contract already exists"
- Change contract name in `Clarinet.toml`
- Or use different deployer address

### Script won't execute
```bash
chmod +x scripts/generate-wallet.sh
```

## 🎓 Key Concepts

### Mnemonic (Seed Phrase)
- 24 words that generate your wallet
- BIP39 standard
- Can restore wallet on any device
- **Must be kept secret and secure**

### Derivation Path
- Stacks uses: `m/44'/5757'/0'/0/n`
- BIP32/BIP44 standard
- Multiple addresses from one mnemonic

### Clarity 4 & Epoch 3.3
- Latest Clarity version
- Enhanced features (stacks-block-time, contract-hash?, etc.)
- Configured in `Clarinet.toml`

## ✅ Contract Features

| Feature | Status |
|---------|--------|
| Clarity 4 compatible | ✅ |
| Epoch 3.3 | ✅ |
| Event logging | ✅ |
| Comprehensive tests | ✅ (8 tests) |
| Deployment ready | ✅ |
| Security best practices | ✅ |

## 📝 Next Steps

1. **Generate your wallet** using `./scripts/generate-wallet.sh`
2. **Get testnet STX** from the faucet
3. **Deploy to testnet** following [QUICK_START.md](QUICK_START.md)
4. **Test thoroughly** before considering mainnet
5. **Consider security audit** for mainnet deployment

---

**🎉 You're all set! Ready to generate wallets and deploy to Stacks!**

For questions or issues, refer to:
- [WALLET_GENERATION_GUIDE.md](WALLET_GENERATION_GUIDE.md) - Detailed wallet guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment documentation
- [Stacks Discord](https://discord.gg/stacks) - Community support
