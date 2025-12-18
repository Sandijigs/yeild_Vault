# 🏦 Yield Vault - Clarity 4 DeFi Protocol

> **Time-Locked Yield Vault with Hiro Chainhooks Integration**
> Built for the Stacks Builder Challenge with Clarity 4 and comprehensive monitoring

[![Contract Status](https://img.shields.io/badge/Contract-Deployed-success)](https://explorer.hiro.so/txid/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043?chain=testnet)
[![Clarity Version](https://img.shields.io/badge/Clarity-v4-blue)](https://docs.stacks.co/clarity)
[![Chainhooks](https://img.shields.io/badge/Chainhooks-Integrated-orange)](https://github.com/hirosystems/chainhooks)
[![Epoch](https://img.shields.io/badge/Epoch-3.3-purple)](https://docs.stacks.co)

## 🚨 IMPORTANT: Contract Successfully Deployed on Testnet!

**Contract Address**: `ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault`
**Transaction**: [`0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043`](https://explorer.hiro.so/txid/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043?chain=testnet)
**Block**: 3701326 | **Date**: 2025-12-18

## 📊 Leaderboard Tracking Features

This project is optimized for the **Stacks Builder Challenge** leaderboard with:

✅ **Hiro Chainhooks Integration** - Real-time event monitoring
✅ **User Activity Tracking** - Comprehensive metrics collection
✅ **Fee Generation Monitoring** - Transaction fee analytics
✅ **GitHub Contributions** - Public repository with active development

## 📋 Requirements

- **Clarinet 3.11.0+** (Clarinet 4 compatible)
- **Clarity Version 4** with **Epoch 3.3**
- Deno (for running tests)

## 🎯 Clarity 4 Features Used

| Feature | Usage |
|---------|-------|
| `stacks-block-time` | Calculate yield based on actual elapsed time (not blocks) |
| `contract-hash?` | Verify approved token contracts before interactions |
| `to-ascii?` | Generate human-readable deposit receipts |

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Time-Locked Yield Vault                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   User Deposits STX → Selects Lock Period → Earns Yield     │
│                                                             │
│   Lock Periods:                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │ 30 Days │ │ 90 Days │ │180 Days │ │365 Days │          │
│   │  3% APY │ │  5% APY │ │  8% APY │ │ 12% APY │          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│   Yield = Principal × Rate × TimeElapsed / Year             │
│                    (using stacks-block-time)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
02-yield-vault/
├── Clarinet.toml
├── contracts/
│   └── yield-vault.clar
├── tests/
│   └── yield-vault_test.ts
└── README.md
```

## 🚀 Quick Start for AI Agents

```bash
# 1. Check contract deployment status
curl -s https://api.testnet.hiro.so/extended/v1/address/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault

# 2. Interact with the contract
node scripts/interact.js get-tvl

# 3. Monitor events with Chainhooks
node scripts/monitor-chainhooks.js --demo

# 4. View metrics
cat metrics.json
```

### Manual Setup

```bash
# Clone and navigate to project
cd yield-vault

# Verify Clarity 4 configuration
cat Clarinet.toml | grep -A2 "\[contracts"
# Should show:
#   clarity_version = 4
#   epoch = 3.3

# Check contract syntax
clarinet check

# Run interaction scripts
node scripts/interact.js info

# Start Chainhooks monitoring
node scripts/monitor-chainhooks.js
```

### Console Examples

```clarity
;; Create a yield pool (admin)
(contract-call? .yield-vault create-pool "STX Yield Pool" u1000000 u1000000000000)

;; Deposit 100 STX for 90 days
(contract-call? .yield-vault deposit u100000000 u7776000 u1)

;; Check yield accrued
(contract-call? .yield-vault calculate-yield u1)

;; Check if vault is unlocked
(contract-call? .yield-vault is-vault-unlocked u1)

;; Withdraw after lock expires
(contract-call? .yield-vault withdraw u1)
```

## 📋 Contract Functions

### Admin Functions
| Function | Description |
|----------|-------------|
| `create-pool` | Create a new yield pool |
| `deactivate-pool` | Deactivate a pool |
| `approve-contract` | Approve a token contract |

### User Functions
| Function | Description |
|----------|-------------|
| `deposit` | Lock STX for yield |
| `withdraw` | Withdraw after lock expires |
| `emergency-withdraw` | Early exit with 10% penalty |
| `fund-treasury` | Add funds to protocol treasury |

### Read-Only Functions
| Function | Description |
|----------|-------------|
| `get-vault` | Get vault details |
| `get-pool` | Get pool details |
| `calculate-yield` | Calculate accrued yield |
| `is-vault-unlocked` | Check if lock expired |
| `get-yield-rate` | Get APY for lock period |
| `generate-deposit-receipt` | Generate receipt string |
| `get-tvl` | Get total value locked |

## 💡 Key Features

1. **Time-Based Yield**: Uses `stacks-block-time` for accurate interest calculation
2. **Multiple Lock Tiers**: 30/90/180/365 day options with increasing APY
3. **Emergency Exit**: 10% penalty for early withdrawal
4. **Contract Verification**: Uses `contract-hash?` for token whitelisting
5. **User Statistics**: Track deposits, yields, and vault counts
6. **Protocol Treasury**: Collects penalties and protocol fees

## 🔒 Security

- Time-locked withdrawals using blockchain timestamps
- Contract verification before token interactions
- Nonce tracking for replay protection
- Owner-only admin functions

## 🧪 Testing

The project includes **22 comprehensive tests** covering:

- ✅ Pool creation and management
- ✅ Deposit validation (min/max amounts, lock periods)
- ✅ Yield calculations with time-based accrual
- ✅ Withdrawal logic (normal and emergency)
- ✅ Double-withdrawal prevention
- ✅ Authorization and access control
- ✅ User statistics tracking
- ✅ TVL (Total Value Locked) updates
- ✅ Contract approval system
- ✅ Treasury funding
- ✅ Clarity 4 feature usage (`stacks-block-time`, `to-ascii?`, `contract-hash?`)

Run tests:
```bash
deno test --allow-all tests/yield-vault_test.ts
```

## 📡 Chainhooks Integration

### Configuration
The project includes a complete Chainhooks setup in `chainhooks/chainhook.yaml`:
- Monitors all contract function calls
- Tracks deposits, withdrawals, and pool creation
- Aggregates metrics for leaderboard
- Sends webhook notifications for events

### Start Monitoring
```bash
# Start the Chainhooks monitor
node scripts/monitor-chainhooks.js

# With demo events for testing
node scripts/monitor-chainhooks.js --demo
```

## 🤖 AI Agent Instructions

This project is optimized for AI agent interaction. All necessary information is available in:

1. **PROJECT_METADATA.json** - Complete project metadata
   - Contract addresses
   - Function signatures
   - Deployment information
   - Integration details

2. **scripts/interact.js** - Contract interaction tool
   ```bash
   node scripts/interact.js get-tvl
   node scripts/interact.js deposit 100000000 30_DAYS 1
   ```

3. **scripts/monitor-chainhooks.js** - Event monitoring
   ```bash
   node scripts/monitor-chainhooks.js --demo
   ```

4. **metrics.json** - Real-time metrics (generated by monitor)

### AI Agent Quick Access
```javascript
// Load all project data
const metadata = require('./PROJECT_METADATA.json');
const contractAddress = metadata.deployment.testnet.contract_address;
// Output: ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault
```

## 🏆 Builder Challenge Compliance

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| **Hiro Chainhooks** | Full integration with monitoring script | ✅ |
| **User Tracking** | Comprehensive user metrics collection | ✅ |
| **Fee Generation** | All transactions generate and track fees | ✅ |
| **GitHub Contributions** | Public repository with documentation | ✅ |
| **Clarity 4** | Fully compatible with epoch 3.3 | ✅ |
| **Contract Deployed** | Live on testnet with verified transaction | ✅ |

### Leaderboard Metrics Tracked:
- Total unique users interacting with contract
- Total fees generated in STX
- Number of transactions processed
- Daily active users
- Total value locked (TVL)
- GitHub repository contributions

## 📋 Complete Function Reference

### For AI Agents - Direct API Calls

```bash
# Get Total Value Locked
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/yield-vault/get-tvl" \
  -H "Content-Type: application/json" \
  -d '{"sender":"ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ","arguments":[]}'

# Get Vault Details (replace vault_id)
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/yield-vault/get-vault" \
  -H "Content-Type: application/json" \
  -d '{"sender":"ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ","arguments":["0x0100000000000000000000000000000001"]}'
```

## 📜 License

MIT License

## 🔗 Important Links

- **Contract on Explorer**: [View on Hiro Explorer](https://explorer.hiro.so/txid/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043?chain=testnet)
- **Stacks Documentation**: [docs.stacks.co](https://docs.stacks.co)
- **Hiro Chainhooks**: [github.com/hirosystems/chainhooks](https://github.com/hirosystems/chainhooks)
- **Builder Challenge**: [stacks.org/challenge](https://stacks.org/challenge)

---

**Built for the Stacks Builder Challenge** | **Clarity 4** | **Epoch 3.3** | **Deployed on Testnet**
