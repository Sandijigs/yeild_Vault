# Quick Start: Deploy Yield-Vault to Testnet

## 🚀 5-Minute Deployment Guide

### Prerequisites
```bash
# Install Stacks CLI
npm install -g @stacks/cli
```

### Step 1: Generate Wallet (30 seconds)
```bash
cd yield-vault
./scripts/generate-wallet.sh
# Select option 1 for testnet
```

**Save the output!** You'll need:
- Your Stacks address (starts with `ST`)
- Your wallet mnemonic (24 words)

### Step 2: Get Testnet STX (5 minutes)
1. Go to: https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. Paste your `ST` address
3. Click "Request STX"
4. Wait ~5 minutes

### Step 3: Configure (1 minute)
```bash
# Edit settings/Testnet.toml
# Replace YOUR_24_WORD_MNEMONIC... with your actual mnemonic from Step 1
```

### Step 4: Deploy (2 minutes)
```bash
# Generate deployment plan
clarinet deployments generate --testnet

# Deploy!
clarinet deployments apply --testnet
```

### Step 5: Verify
Visit: `https://explorer.hiro.so/address/YOUR_ADDRESS.yield-vault?chain=testnet`

## ✅ Done!

Your contract is now live on testnet at:
```
YOUR_ADDRESS.yield-vault
```

## Next Steps

1. **Create a pool:**
   ```clarity
   (contract-call? .yield-vault create-pool "STX Pool" u1000000 u1000000000000)
   ```

2. **Test deposit:**
   ```clarity
   (contract-call? .yield-vault deposit u100000000 u2592000 u1)
   ```

3. **Check yield:**
   ```clarity
   (contract-call? .yield-vault calculate-yield u1)
   ```

## 📚 Full Documentation

- Detailed guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Wallet guide: [WALLET_GENERATION_GUIDE.md](WALLET_GENERATION_GUIDE.md)
- Contract docs: [README.md](README.md)

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| No testnet STX | Wait longer or retry faucet |
| Invalid mnemonic | Check for typos in Testnet.toml |
| Command not found | Install @stacks/cli globally |

---

**🎉 You're ready to deploy!**
