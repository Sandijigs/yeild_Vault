# 💰 Time-Locked Yield Vault

A DeFi savings protocol with real-time yield accrual built with **Clarity 4** on Stacks.

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

## 🚀 Quick Start

```bash
cd 02-yield-vault
clarinet check
clarinet test
clarinet console
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

## 🏆 Builder Challenge Points

- ✅ `stacks-block-time` for yield calculations
- ✅ `contract-hash?` for contract verification
- ✅ `to-ascii?` for receipt generation
- ✅ Complete test suite
- ✅ Production-ready DeFi protocol

## 📜 License

MIT License
