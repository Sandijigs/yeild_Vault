# Yield-Vault Deployment Guide

Complete guide for deploying the yield-vault smart contract to Stacks testnet or mainnet.

## Prerequisites

1. **Install @stacks/cli**
   ```bash
   npm install -g @stacks/cli
   ```

2. **Verify Clarinet installation**
   ```bash
   clarinet --version
   ```

## Step 1: Generate Deployment Wallet

### Option A: Using the Included Script

```bash
cd yield-vault
./scripts/generate-wallet.sh
```

Follow the prompts to generate a testnet or mainnet wallet.

### Option B: Manual Generation

```bash
# For testnet
stx make_keychain -t > testnet_wallet.json

# For mainnet
stx make_keychain > mainnet_wallet.json
```

### Output

The generated wallet file contains:
- **mnemonic**: 24-word seed phrase (BACKUP THIS SECURELY!)
- **privateKey**: Your private key (NEVER SHARE!)
- **address**: Your Stacks address (ST... for testnet, SP... for mainnet)
- **btcAddress**: Associated Bitcoin address
- **index**: Derivation path index

## Step 2: Fund Your Wallet

### For Testnet

1. Copy your testnet address from the wallet file (starts with `ST`)
2. Visit the [Hiro Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
3. Paste your address and request STX tokens
4. Wait 5-10 minutes for confirmation
5. Verify balance at: `https://explorer.hiro.so/address/YOUR_ADDRESS?chain=testnet`

**Recommended testnet balance**: At least 1,000 STX for deployment and testing

### For Mainnet

1. Purchase STX tokens from an exchange
2. Send STX to your mainnet address (starts with `SP`)
3. Verify balance at: `https://explorer.hiro.so/address/YOUR_ADDRESS`

**Estimated deployment cost**: 50-200 STX (varies by network congestion)

## Step 3: Configure Deployment Settings

### Update Testnet.toml

1. Open `settings/Testnet.toml`
2. Replace the placeholder mnemonic with your wallet's mnemonic:

```toml
[accounts.deployer]
mnemonic = "YOUR 24 WORD MNEMONIC PHRASE FROM STEP 1"
```

**⚠️ SECURITY WARNING**: Never commit this file to git! It's in `.gitignore` for protection.

### Update Mainnet.toml (for mainnet deployment)

Create `settings/Mainnet.toml`:

```toml
[network]
name = "mainnet"
node_rpc_address = "https://api.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "YOUR MAINNET 24 WORD MNEMONIC"

[mainnet]
stacks_node_rpc_address = "https://api.hiro.so"
bitcoin_node_rpc_address = "https://blockstream.info/api"
```

## Step 4: Generate Deployment Plan

### For Testnet

```bash
cd yield-vault

# Generate deployment plan
clarinet deployments generate --testnet

# This creates: deployments/default.testnet-plan.yaml
```

### For Mainnet

```bash
# Generate mainnet deployment plan
clarinet deployments generate --mainnet

# This creates: deployments/default.mainnet-plan.yaml
```

### Review the Plan

Open the generated `.yaml` file and review:
- Contract deployment order
- Estimated costs
- Transaction parameters

## Step 5: Check Deployment

Before deploying, verify everything is correct:

```bash
# Check testnet deployment
clarinet deployments check --testnet

# Check mainnet deployment
clarinet deployments check --mainnet
```

This command validates:
- Wallet has sufficient balance
- Contract syntax is correct
- Network connectivity

## Step 6: Deploy to Network

### Deploy to Testnet

```bash
cd yield-vault

# Deploy to testnet
clarinet deployments apply --testnet

# Follow the prompts and confirm deployment
```

### Deploy to Mainnet

⚠️ **MAINNET DEPLOYMENT - DOUBLE CHECK EVERYTHING!**

```bash
# FINAL CHECK before mainnet deployment
clarinet deployments check --mainnet

# Deploy to mainnet (IRREVERSIBLE!)
clarinet deployments apply --mainnet
```

## Step 7: Verify Deployment

### Check on Explorer

**Testnet:**
```
https://explorer.hiro.so/txid/YOUR_TX_ID?chain=testnet
```

**Mainnet:**
```
https://explorer.hiro.so/txid/YOUR_TX_ID
```

### Verify Contract

Your contract address will be:
```
YOUR_ADDRESS.yield-vault
```

Example:
- Testnet: `ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG.yield-vault`
- Mainnet: `SP2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG.yield-vault`

## Step 8: Initialize the Contract

After deployment, initialize your first yield pool:

### Using Clarinet Console

```bash
# Connect to testnet
clarinet console --testnet

# Create the first pool
(contract-call? .yield-vault create-pool "STX Yield Pool" u1000000 u1000000000000)
```

### Using Hiro Wallet + Sandbox

1. Go to [Hiro Sandbox](https://explorer.hiro.so/sandbox/contract-call)
2. Enter your contract address: `YOUR_ADDRESS.yield-vault`
3. Select function: `create-pool`
4. Parameters:
   - name: "STX Yield Pool"
   - min-deposit: 1000000 (1 STX in micro-STX)
   - max-deposit: 1000000000000 (1M STX)
5. Sign with Hiro Wallet and submit

## Post-Deployment Checklist

- [ ] Contract deployed successfully
- [ ] Transaction confirmed on explorer
- [ ] Contract address verified
- [ ] Initial pool created
- [ ] Contract functions tested
- [ ] Wallet mnemonic backed up securely
- [ ] Deployment costs documented

## Troubleshooting

### "Insufficient balance" Error

**Solution**: Fund your wallet with more STX
- Testnet: Use faucet
- Mainnet: Purchase and transfer STX

### "Invalid mnemonic" Error

**Solution**: Verify your mnemonic in `settings/Testnet.toml`
- Must be 24 words separated by spaces
- No extra quotes or special characters
- Use the exact mnemonic from wallet generation

### "Network timeout" Error

**Solution**: Check network connectivity
```bash
# Test testnet connection
curl https://api.testnet.hiro.so/v2/info

# Test mainnet connection
curl https://api.hiro.so/v2/info
```

### "Contract already exists" Error

**Solution**: Contract name is already taken
- Change contract name in `Clarinet.toml`
- Or use a different deployer address

## Cost Estimates

### Testnet
- **Contract Deployment**: ~0.5 STX (free from faucet)
- **Pool Creation**: ~0.1 STX
- **Total**: ~0.6 STX

### Mainnet
- **Contract Deployment**: 50-200 STX (varies)
- **Pool Creation**: 10-50 STX
- **Buffer**: Keep 2-3x estimate for safety
- **Recommended**: 500 STX minimum

## Security Best Practices

1. ✅ Use different wallets for testnet and mainnet
2. ✅ Never commit wallet files or mnemonics to git
3. ✅ Backup mnemonics offline (paper, encrypted USB)
4. ✅ Test thoroughly on testnet before mainnet
5. ✅ Use hardware wallets for large mainnet deployments
6. ✅ Audit contracts before mainnet deployment
7. ✅ Start with small amounts in production
8. ✅ Monitor contract events after deployment

## Monitoring After Deployment

### Check Contract Activity

```bash
# View contract transactions
https://explorer.hiro.so/address/YOUR_ADDRESS.yield-vault?chain=testnet
```

### Monitor Events

Events are logged for:
- Deposits
- Withdrawals  
- Emergency withdrawals
- Pool creation
- Pool deactivation

Access via Stacks blockchain API or explorer.

## Updating the Contract

**Note**: Smart contracts on Stacks are immutable once deployed.

To update:
1. Deploy a new version with a different name
2. Migrate users to the new contract
3. Deactivate old pools if needed

## Additional Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarinet Documentation](https://github.com/hirosystems/clarinet)
- [Hiro Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- [Hiro Explorer](https://explorer.hiro.so/)
- [Stacks Discord](https://discord.gg/stacks)

## Support

For issues with:
- **Clarinet**: [GitHub Issues](https://github.com/hirosystems/clarinet/issues)
- **Stacks CLI**: [@stacks/cli](https://www.npmjs.com/package/@stacks/cli)
- **Yield-Vault Contract**: Check contract documentation

---

**Remember**: Test on testnet first, secure your mnemonics, and never rush mainnet deployments!
