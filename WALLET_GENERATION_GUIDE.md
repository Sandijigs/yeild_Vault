# Stacks Wallet Address Generation Guide

This guide explains how to generate Stacks wallet addresses for deploying the yield-vault smart contract to testnet or mainnet.

## Method 1: Using @stacks/cli (Recommended)

### Installation

```bash
npm install -g @stacks/cli
```

### Generate a New Testnet Wallet

```bash
# Generate new wallet for testnet
stx make_keychain -t > testnet_wallet.json

# View the generated wallet details
cat testnet_wallet.json
```

**Output includes:**
- `mnemonic`: 24-word seed phrase (KEEP THIS SECURE!)
- `keyInfo.privateKey`: Private key (NEVER SHARE!)
- `keyInfo.address`: Your Stacks testnet address (ST...)
- `keyInfo.btcAddress`: Associated Bitcoin testnet address
- `keyInfo.index`: Derivation index (usually 0)

### Generate Mainnet Wallet

```bash
# Generate new wallet for mainnet
stx make_keychain > mainnet_wallet.json
```

### Use Existing Mnemonic

```bash
# Generate keys from existing 24-word mnemonic
stx make_keychain -t "your twenty four word mnemonic phrase goes here in quotes"
```

## Method 2: Using Clarinet Deployments

### Generate Deployment Configuration

```bash
cd yield-vault

# Generate testnet deployment
clarinet deployments generate --testnet

# This creates: deployments/default.testnet-plan.yaml
```

### Update Testnet Configuration

1. Edit `settings/Testnet.toml`
2. Replace the placeholder mnemonic with your generated one
3. Never commit real mnemonics to version control!

## Method 3: Using Hiro Web Wallet (Browser)

1. Install [Hiro Wallet](https://wallet.hiro.so/) browser extension
2. Create new wallet or import existing mnemonic
3. Switch network to Testnet (Settings → Network)
4. Copy your Stacks address (starts with ST for testnet, SP for mainnet)
5. Export your mnemonic securely (Settings → Secret Key)

## Getting Testnet STX Tokens

After generating your testnet wallet:

1. Visit [Hiro Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
2. Enter your testnet Stacks address (ST...)
3. Request testnet STX tokens (usually 500 STX)
4. Wait for confirmation (~10 minutes)

## Security Best Practices

### ⚠️ CRITICAL SECURITY RULES

1. **NEVER** commit mnemonics or private keys to git
2. **ALWAYS** use environment variables or encrypted storage for production
3. **NEVER** share your mnemonic or private key with anyone
4. **ALWAYS** backup your mnemonic securely (offline, encrypted)
5. **USE** different wallets for testnet and mainnet

### Environment Variables Approach (Recommended)

Instead of storing mnemonics in `Testnet.toml`, use environment variables:

```bash
# Set environment variable
export STACKS_DEPLOYER_MNEMONIC="your twenty four word mnemonic here"

# Use in deployment scripts
clarinet deployments apply --testnet
```

### Encryption (Advanced)

Clarinet supports encrypting mnemonics:

```bash
# Encrypt deployment mnemonic
clarinet deployments encrypt --testnet

# This encrypts the mnemonic in your deployment files
```

## Wallet Address Formats

- **Testnet**: Addresses start with `ST` (e.g., ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
- **Mainnet**: Addresses start with `SP` (e.g., SP2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
- **Contract**: Format is `<address>.<contract-name>` (e.g., ST...AG.yield-vault)

## Derivation Path

Stacks uses BIP39/BIP32 derivation:
- Path: `m/44'/5757'/0'/0/0` (first account)
- Path: `m/44'/5757'/0'/0/1` (second account)
- etc.

## Example Workflow

```bash
# 1. Install Stacks CLI
npm install -g @stacks/cli

# 2. Generate testnet wallet
stx make_keychain -t > my_testnet_wallet.json

# 3. View your address
cat my_testnet_wallet.json | grep "address"

# 4. Get testnet STX
# Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet

# 5. Update Testnet.toml with your mnemonic
# Edit: settings/Testnet.toml

# 6. Generate deployment plan
clarinet deployments generate --testnet

# 7. Check deployment
clarinet deployments check --testnet

# 8. Deploy to testnet
clarinet deployments apply --testnet
```

## Verify Wallet Balance

Check your wallet balance on:
- **Testnet**: https://explorer.hiro.so/?chain=testnet
- **Mainnet**: https://explorer.hiro.so/

## Additional Resources

- [Stacks Documentation - Accounts](https://docs.stacks.co/stacks-101/accounts)
- [Clarinet Deployments Guide](https://github.com/hirosystems/clarinet)
- [Hiro Web Wallet](https://wallet.hiro.so/)
- [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- [@stacks/cli NPM Package](https://www.npmjs.com/package/@stacks/cli)

## Quick Reference

| Tool | Purpose | Installation |
|------|---------|--------------|
| `@stacks/cli` | Generate wallets, keys | `npm install -g @stacks/cli` |
| Hiro Wallet | Browser wallet | Chrome/Firefox extension |
| Clarinet | Deploy contracts | Already installed |
| Testnet Faucet | Get test STX | https://explorer.hiro.so/sandbox/faucet?chain=testnet |

---

**Remember**: Your mnemonic = Your funds. Keep it safe!
