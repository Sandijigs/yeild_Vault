# 🤖 AI Agent Execution Guide for Yield Vault

## Quick Contract Information

**Contract Address**: `ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault`
**Network**: Testnet
**Deployment TX**: `0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043`
**Block**: 3701326

## 🚀 One-Line Commands for AI Agents

### 1. Check Contract Status
```bash
curl -s "https://api.testnet.hiro.so/extended/v1/address/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ" | grep yield-vault
```

### 2. Get Total Value Locked (TVL)
```bash
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/yield-vault/get-tvl" -H "Content-Type: application/json" -d '{"sender":"ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ","arguments":[]}'
```

### 3. Get Current Block Time
```bash
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/yield-vault/get-current-time" -H "Content-Type: application/json" -d '{"sender":"ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ","arguments":[]}'
```

### 4. Check Vault Details (Vault ID = 1)
```bash
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/yield-vault/get-vault" -H "Content-Type: application/json" -d '{"sender":"ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ","arguments":["0x0100000000000000000000000000000001"]}'
```

## 📊 Leaderboard Metrics Collection

The contract tracks the following for the Stacks Builder Challenge:

1. **Hiro Chainhooks Integration**: ✅ Complete
   - Configuration: `chainhooks/chainhook.yaml`
   - Monitor script: `scripts/monitor-chainhooks.js`

2. **User Activity Tracking**: ✅ Implemented
   - Unique users counted per transaction
   - Daily active users tracked
   - User statistics stored on-chain

3. **Fee Generation**: ✅ Active
   - Every transaction generates fees
   - Emergency withdrawals have 10% penalty
   - Fees tracked in metrics

4. **GitHub Contributions**: ✅ Ready
   - Complete documentation
   - Multiple scripts for interaction
   - AI-friendly metadata

## 🔧 Script Execution (When Node.js Available)

```bash
# Install Node.js first if needed
brew install node  # macOS
# or
apt-get install nodejs  # Linux

# Then run scripts
node scripts/interact.js info
node scripts/interact.js get-tvl
node scripts/monitor-chainhooks.js --demo
node scripts/test-contract.js
```

## 📁 Important Files for AI Agents

1. **PROJECT_METADATA.json** - Complete project information
2. **scripts/interact.js** - Contract interaction tool
3. **scripts/monitor-chainhooks.js** - Event monitoring with Chainhooks
4. **scripts/test-contract.js** - Automated testing
5. **chainhooks/chainhook.yaml** - Chainhooks configuration
6. **contracts/yield-vault.clar** - Smart contract source

## 🎯 Key Functions to Monitor

### Read-Only (No gas fees)
- `get-tvl()` - Total value locked
- `get-vault(vault-id)` - Vault details
- `get-pool(pool-id)` - Pool information
- `calculate-yield(vault-id)` - Current yield
- `is-vault-unlocked(vault-id)` - Check if withdrawable
- `get-current-time()` - Blockchain timestamp

### Public Functions (Require STX)
- `deposit(amount, lock-period, pool-id)` - Create vault
- `withdraw(vault-id)` - Withdraw matured vault
- `emergency-withdraw(vault-id)` - Early exit with penalty

## 🏆 Builder Challenge Proof

### Contract Successfully Deployed ✅
- Transaction: [0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043](https://explorer.hiro.so/txid/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043?chain=testnet)
- Block: 3701326
- Date: 2025-12-18T19:03:33.000Z

### Clarity 4 Features Used ✅
- `stacks-block-time` for time calculations
- `as-contract?` with `(with-stx amount)` pattern
- `contract-hash?` for verification
- `to-ascii?` for receipts

### Chainhooks Integration ✅
- Full configuration in `chainhooks/chainhook.yaml`
- Monitoring script ready
- Webhook endpoints configured
- Metrics aggregation implemented

## 💡 Quick Test Workflow

```bash
# 1. Verify deployment
curl -s "https://api.testnet.hiro.so/extended/v1/tx/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043" | grep success

# 2. Check contract exists
curl -s "https://api.testnet.hiro.so/extended/v1/address/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/transactions" | grep yield-vault

# 3. Test read function
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ/yield-vault/get-tvl" -H "Content-Type: application/json" -d '{"sender":"ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ","arguments":[]}'
```

## 📈 Expected Metrics Output

When monitoring is active, the system tracks:
```json
{
  "totalUniqueUsers": 0,
  "totalTransactions": 0,
  "totalFeesGeneratedSTX": 0,
  "totalValueLockedSTX": 0,
  "dailyActiveUsers": 0,
  "chainhooksIntegration": true,
  "githubContributions": true
}
```

---

**This project is fully deployed and ready for the Stacks Builder Challenge leaderboard tracking!**