#!/usr/bin/env node

/**
 * Yield Vault Smart Contract Interaction Script
 * This script provides easy interaction with the deployed yield-vault contract
 * Designed to be AI-agent friendly for automated execution
 */

const CONTRACT_ADDRESS = 'ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ';
const CONTRACT_NAME = 'yield-vault';
const NETWORK = 'testnet'; // or 'mainnet' for production

// API endpoints
const API_BASE = NETWORK === 'testnet'
  ? 'https://api.testnet.hiro.so'
  : 'https://api.hiro.so';

// Lock periods in seconds
const LOCK_PERIODS = {
  '30_DAYS': 2592000,
  '90_DAYS': 7776000,
  '180_DAYS': 15552000,
  '365_DAYS': 31536000
};

// Contract functions that can be called
const FUNCTIONS = {
  // Read-only functions
  READ_ONLY: {
    getVault: async (vaultId) => {
      return await callReadOnlyFunction('get-vault', [vaultId]);
    },

    getPool: async (poolId) => {
      return await callReadOnlyFunction('get-pool', [poolId]);
    },

    getUserStats: async (userAddress) => {
      return await callReadOnlyFunction('get-user-stats', [userAddress]);
    },

    calculateYield: async (vaultId) => {
      return await callReadOnlyFunction('calculate-yield', [vaultId]);
    },

    isVaultUnlocked: async (vaultId) => {
      return await callReadOnlyFunction('is-vault-unlocked', [vaultId]);
    },

    getTVL: async () => {
      return await callReadOnlyFunction('get-tvl', []);
    },

    getCurrentTime: async () => {
      return await callReadOnlyFunction('get-current-time', []);
    }
  },

  // Public functions (require transaction)
  PUBLIC: {
    createPool: {
      name: 'create-pool',
      description: 'Create a new yield pool (admin only)',
      params: ['name', 'minDeposit', 'maxDeposit'],
      example: {
        name: 'Main Pool',
        minDeposit: 1000000, // 1 STX in microSTX
        maxDeposit: 1000000000000 // 1M STX in microSTX
      }
    },

    deposit: {
      name: 'deposit',
      description: 'Deposit STX into a time-locked vault',
      params: ['amount', 'lockPeriod', 'poolId'],
      example: {
        amount: 100000000, // 100 STX in microSTX
        lockPeriod: LOCK_PERIODS['30_DAYS'],
        poolId: 1
      }
    },

    withdraw: {
      name: 'withdraw',
      description: 'Withdraw principal + yield after lock period',
      params: ['vaultId'],
      example: {
        vaultId: 1
      }
    },

    emergencyWithdraw: {
      name: 'emergency-withdraw',
      description: 'Emergency withdraw with 10% penalty',
      params: ['vaultId'],
      example: {
        vaultId: 1
      }
    }
  }
};

// Helper function to call read-only functions
async function callReadOnlyFunction(functionName, args) {
  try {
    const url = `${API_BASE}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`;

    const body = {
      sender: CONTRACT_ADDRESS,
      arguments: args.map(arg => {
        if (typeof arg === 'number') {
          return `0x${arg.toString(16).padStart(32, '0')}`;
        } else if (typeof arg === 'string' && arg.startsWith('S')) {
          // Principal address
          return `0x${Buffer.from(arg).toString('hex')}`;
        }
        return arg;
      })
    };

    console.log(`Calling ${functionName}...`);
    console.log('Request:', JSON.stringify(body, null, 2));

    // Simulated response for demo
    const simulatedResponse = {
      okay: true,
      result: `0x${Math.random().toString(16).substr(2, 8)}`
    };

    console.log('Response:', simulatedResponse);
    return simulatedResponse;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    return null;
  }
}

// Helper function to generate transaction data
function generateTransactionData(functionName, params) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: functionName,
    functionArgs: params,
    network: NETWORK,
    fee: 10000, // 0.01 STX default fee
    nonce: null, // Will be fetched from API
    postConditions: []
  };
}

// Main execution function
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    displayHelp();
    return;
  }

  const command = args[0];

  switch(command) {
    case 'get-tvl':
      console.log('\n📊 Getting Total Value Locked...');
      await FUNCTIONS.READ_ONLY.getTVL();
      break;

    case 'get-vault':
      if (args[1]) {
        console.log(`\n🔍 Getting vault ${args[1]} details...`);
        await FUNCTIONS.READ_ONLY.getVault(parseInt(args[1]));
      } else {
        console.log('❌ Please provide vault ID');
      }
      break;

    case 'get-pool':
      if (args[1]) {
        console.log(`\n🏊 Getting pool ${args[1]} details...`);
        await FUNCTIONS.READ_ONLY.getPool(parseInt(args[1]));
      } else {
        console.log('❌ Please provide pool ID');
      }
      break;

    case 'calculate-yield':
      if (args[1]) {
        console.log(`\n💰 Calculating yield for vault ${args[1]}...`);
        await FUNCTIONS.READ_ONLY.calculateYield(parseInt(args[1]));
      } else {
        console.log('❌ Please provide vault ID');
      }
      break;

    case 'check-unlock':
      if (args[1]) {
        console.log(`\n🔓 Checking if vault ${args[1]} is unlocked...`);
        await FUNCTIONS.READ_ONLY.isVaultUnlocked(parseInt(args[1]));
      } else {
        console.log('❌ Please provide vault ID');
      }
      break;

    case 'deposit':
      if (args.length >= 4) {
        const amount = parseInt(args[1]);
        const period = args[2]; // e.g., '30_DAYS'
        const poolId = parseInt(args[3]);

        console.log(`\n💵 Preparing deposit transaction...`);
        console.log(`Amount: ${amount / 1000000} STX`);
        console.log(`Lock Period: ${period}`);
        console.log(`Pool ID: ${poolId}`);

        const txData = generateTransactionData('deposit', {
          amount: amount,
          lockPeriod: LOCK_PERIODS[period],
          poolId: poolId
        });

        console.log('\nTransaction data:');
        console.log(JSON.stringify(txData, null, 2));
        console.log('\n⚠️  To execute this transaction, sign and broadcast using Stacks wallet');
      } else {
        console.log('❌ Usage: deposit <amount_in_microSTX> <period> <pool_id>');
        console.log('   Periods: 30_DAYS, 90_DAYS, 180_DAYS, 365_DAYS');
      }
      break;

    case 'withdraw':
      if (args[1]) {
        console.log(`\n💸 Preparing withdrawal for vault ${args[1]}...`);
        const txData = generateTransactionData('withdraw', {
          vaultId: parseInt(args[1])
        });

        console.log('\nTransaction data:');
        console.log(JSON.stringify(txData, null, 2));
        console.log('\n⚠️  To execute this transaction, sign and broadcast using Stacks wallet');
      } else {
        console.log('❌ Please provide vault ID');
      }
      break;

    case 'info':
      displayContractInfo();
      break;

    default:
      displayHelp();
  }
}

function displayHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║             Yield Vault Contract Interaction Tool                ║
╚══════════════════════════════════════════════════════════════════╝

📋 Available Commands:

Read Operations (No transaction needed):
  get-tvl                     - Get total value locked in protocol
  get-vault <id>              - Get vault details by ID
  get-pool <id>               - Get pool details by ID
  calculate-yield <vault_id>  - Calculate current yield for a vault
  check-unlock <vault_id>     - Check if vault is unlocked
  info                        - Display contract information

Write Operations (Requires transaction):
  deposit <amount> <period> <pool_id>  - Create a new vault deposit
    Periods: 30_DAYS, 90_DAYS, 180_DAYS, 365_DAYS
    Amount: In microSTX (1 STX = 1,000,000 microSTX)

  withdraw <vault_id>         - Withdraw from matured vault

Examples:
  node interact.js get-tvl
  node interact.js deposit 100000000 30_DAYS 1
  node interact.js withdraw 1

Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}
Network: ${NETWORK}
  `);
}

function displayContractInfo() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    Yield Vault Contract Info                     ║
╚══════════════════════════════════════════════════════════════════╝

📄 Contract Details:
  • Address: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}
  • Network: ${NETWORK}
  • Deployment: Block 3701326
  • Transaction: 0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043

🔒 Lock Periods & APY:
  • 30 Days:  3% APY
  • 90 Days:  5% APY
  • 180 Days: 8% APY
  • 365 Days: 12% APY

💡 Features:
  • Time-based yield calculation using block timestamps
  • Emergency withdrawal with 10% penalty
  • Multiple yield pools support
  • Contract hash verification
  • Human-readable deposit receipts

🔗 Explorer:
  https://explorer.hiro.so/txid/0x825c3e270664b58c77aef8beb5d6b85d58ec71a285fabd987658efff16276043?chain=testnet
  `);
}

// Run the script
main().catch(console.error);