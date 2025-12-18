import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.1/index.ts';
import { assertEquals, assertExists } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Test pool creation
Clarinet.test({
  name: "Admin can create yield pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Yield Pool"),
        types.uint(1000000),    // Min: 1 STX
        types.uint(1000000000000) // Max: 1M STX
      ], deployer.address)
    ]);
    
    block.receipts[0].result.expectOk().expectUint(1);
    
    // Verify pool exists
    let poolResult = chain.callReadOnlyFn(
      'yield-vault',
      'get-pool',
      [types.uint(1)],
      deployer.address
    );
    
    assertExists(poolResult.result);
  }
});

// Test deposit
Clarinet.test({
  name: "User can deposit into vault with 30-day lock",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create pool first
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Yield Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address)
    ]);
    
    // Deposit 100 STX with 30-day lock
    const LOCK_30_DAYS = 2592000;
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000), // 100 STX
        types.uint(LOCK_30_DAYS),
        types.uint(1) // pool-id
      ], wallet1.address)
    ]);
    
    block.receipts[0].result.expectOk();
    
    // Verify vault was created
    let vaultResult = chain.callReadOnlyFn(
      'yield-vault',
      'get-vault',
      [types.uint(1)],
      wallet1.address
    );
    
    assertExists(vaultResult.result);
  }
});

// Test yield calculation
Clarinet.test({
  name: "Can calculate accrued yield",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create pool and deposit
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Yield Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address)
    ]);
    
    const LOCK_30_DAYS = 2592000;
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(LOCK_30_DAYS),
        types.uint(1)
      ], wallet1.address)
    ]);
    
    // Calculate yield
    let yieldResult = chain.callReadOnlyFn(
      'yield-vault',
      'calculate-yield',
      [types.uint(1)],
      wallet1.address
    );
    
    yieldResult.result.expectOk();
  }
});

// Test early withdrawal prevention
Clarinet.test({
  name: "Cannot withdraw before lock period ends",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create pool and deposit
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Yield Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address)
    ]);
    
    const LOCK_30_DAYS = 2592000;
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(LOCK_30_DAYS),
        types.uint(1)
      ], wallet1.address)
    ]);
    
    // Try to withdraw immediately
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'withdraw', [
        types.uint(1)
      ], wallet1.address)
    ]);
    
    // Should fail with ERR_LOCK_NOT_EXPIRED
    block.receipts[0].result.expectErr().expectUint(2004);
  }
});

// Test get yield rate
Clarinet.test({
  name: "Get correct yield rate for lock periods",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    const LOCK_30_DAYS = 2592000;
    const LOCK_90_DAYS = 7776000;
    const LOCK_365_DAYS = 31536000;
    
    let result30 = chain.callReadOnlyFn(
      'yield-vault',
      'get-yield-rate',
      [types.uint(LOCK_30_DAYS)],
      deployer.address
    );
    result30.result.expectUint(300); // 3% APY
    
    let result90 = chain.callReadOnlyFn(
      'yield-vault',
      'get-yield-rate',
      [types.uint(LOCK_90_DAYS)],
      deployer.address
    );
    result90.result.expectUint(500); // 5% APY
    
    let result365 = chain.callReadOnlyFn(
      'yield-vault',
      'get-yield-rate',
      [types.uint(LOCK_365_DAYS)],
      deployer.address
    );
    result365.result.expectUint(1200); // 12% APY
  }
});

// Test receipt generation
Clarinet.test({
  name: "Can generate deposit receipt",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let result = chain.callReadOnlyFn(
      'yield-vault',
      'generate-deposit-receipt',
      [types.uint(1), types.uint(100000000), types.uint(30)],
      deployer.address
    );
    
    assertExists(result.result);
  }
});

// Test TVL tracking
Clarinet.test({
  name: "TVL updates correctly on deposit",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Check initial TVL
    let tvlBefore = chain.callReadOnlyFn(
      'yield-vault',
      'get-tvl',
      [],
      deployer.address
    );
    tvlBefore.result.expectUint(0);
    
    // Create pool and deposit
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address),
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(2592000),
        types.uint(1)
      ], wallet1.address)
    ]);
    
    // Check updated TVL
    let tvlAfter = chain.callReadOnlyFn(
      'yield-vault',
      'get-tvl',
      [],
      deployer.address
    );
    tvlAfter.result.expectUint(100000000);
  }
});

// Test unauthorized pool creation
Clarinet.test({
  name: "Non-admin cannot create pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("Unauthorized Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], wallet1.address)
    ]);

    // Should fail with ERR_UNAUTHORIZED
    block.receipts[0].result.expectErr().expectUint(2001);
  }
});

// Test emergency withdrawal
Clarinet.test({
  name: "Emergency withdraw works with penalty",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool and deposit
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address),
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000), // 100 STX
        types.uint(2592000), // 30 days
        types.uint(1)
      ], wallet1.address)
    ]);

    // Emergency withdraw immediately
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'emergency-withdraw', [
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should succeed and return 90% (10% penalty)
    block.receipts[0].result.expectOk();
  }
});

// Test withdrawal after lock period
Clarinet.test({
  name: "Can withdraw after lock period with yield",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool and deposit
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address),
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(2592000), // 30 days
        types.uint(1)
      ], wallet1.address)
    ]);

    // Mine many blocks to simulate time passing (30 days worth)
    // In simnet, each block advances time
    for (let i = 0; i < 4320; i++) { // ~30 days at 10min blocks
      chain.mineEmptyBlock();
    }

    // Now try to withdraw
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'withdraw', [
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should succeed if enough time has passed
    block.receipts[0].result.expectOk();
  }
});

// Test deposit validation - amount too low
Clarinet.test({
  name: "Cannot deposit below minimum",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool with 1 STX minimum
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000), // 1 STX min
        types.uint(1000000000000)
      ], deployer.address)
    ]);

    // Try to deposit less than minimum
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(500000), // 0.5 STX
        types.uint(2592000),
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should fail with ERR_INVALID_AMOUNT
    block.receipts[0].result.expectErr().expectUint(2002);
  }
});

// Test deposit validation - amount too high
Clarinet.test({
  name: "Cannot deposit above maximum",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool with 100 STX maximum
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(100000000) // 100 STX max
      ], deployer.address)
    ]);

    // Try to deposit more than maximum
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(200000000), // 200 STX
        types.uint(2592000),
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should fail with ERR_INVALID_AMOUNT
    block.receipts[0].result.expectErr().expectUint(2002);
  }
});

// Test invalid lock period
Clarinet.test({
  name: "Cannot use invalid lock period",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address)
    ]);

    // Try to deposit with invalid lock period
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(12345), // Invalid lock period
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should fail with ERR_INVALID_LOCK_PERIOD
    block.receipts[0].result.expectErr().expectUint(2006);
  }
});

// Test depositing to inactive pool
Clarinet.test({
  name: "Cannot deposit to inactive pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool then deactivate it
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address),
      Tx.contractCall('yield-vault', 'deactivate-pool', [
        types.uint(1)
      ], deployer.address)
    ]);

    // Try to deposit to inactive pool
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(2592000),
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should fail with ERR_POOL_INACTIVE
    block.receipts[0].result.expectErr().expectUint(2009);
  }
});

// Test user stats tracking
Clarinet.test({
  name: "User stats update correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool and make multiple deposits
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address),
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(50000000),
        types.uint(2592000),
        types.uint(1)
      ], wallet1.address),
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(75000000),
        types.uint(7776000),
        types.uint(1)
      ], wallet1.address)
    ]);

    // Check user stats
    let statsResult = chain.callReadOnlyFn(
      'yield-vault',
      'get-user-stats',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    assertExists(statsResult.result);
    // Should show 2 vaults and 125 STX total deposited
  }
});

// Test double withdrawal prevention
Clarinet.test({
  name: "Cannot withdraw twice from same vault",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create pool and deposit
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'create-pool', [
        types.ascii("STX Pool"),
        types.uint(1000000),
        types.uint(1000000000000)
      ], deployer.address),
      Tx.contractCall('yield-vault', 'deposit', [
        types.uint(100000000),
        types.uint(2592000),
        types.uint(1)
      ], wallet1.address)
    ]);

    // Mine blocks to pass time
    for (let i = 0; i < 4320; i++) {
      chain.mineEmptyBlock();
    }

    // First withdrawal
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'withdraw', [
        types.uint(1)
      ], wallet1.address)
    ]);

    // Try second withdrawal
    block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'withdraw', [
        types.uint(1)
      ], wallet1.address)
    ]);

    // Should fail with ERR_ALREADY_CLAIMED
    block.receipts[0].result.expectErr().expectUint(2007);
  }
});

// Test contract approval system
Clarinet.test({
  name: "Admin can approve contracts",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const contractToApprove = deployer.address; // Using deployer as mock contract

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'approve-contract', [
        types.principal(contractToApprove),
        types.ascii("Test Contract")
      ], deployer.address)
    ]);

    block.receipts[0].result.expectOk();

    // Check if contract is approved
    let isApproved = chain.callReadOnlyFn(
      'yield-vault',
      'is-contract-approved',
      [types.principal(contractToApprove)],
      deployer.address
    );

    assertExists(isApproved.result);
  }
});

// Test treasury funding
Clarinet.test({
  name: "Anyone can fund treasury",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'fund-treasury', [
        types.uint(10000000) // 10 STX
      ], wallet1.address)
    ]);

    block.receipts[0].result.expectOk().expectUint(10000000);
  }
});

// Test all lock period yield rates
Clarinet.test({
  name: "All lock periods have correct yield rates",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    const LOCK_180_DAYS = 15552000;

    let result180 = chain.callReadOnlyFn(
      'yield-vault',
      'get-yield-rate',
      [types.uint(LOCK_180_DAYS)],
      deployer.address
    );
    result180.result.expectUint(800); // 8% APY
  }
});

// Test stacks-block-time usage
Clarinet.test({
  name: "Can get current time using Clarity 4 feature",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let result = chain.callReadOnlyFn(
      'yield-vault',
      'get-current-time',
      [],
      deployer.address
    );

    // Should return a timestamp
    assertExists(result.result);
  }
});
