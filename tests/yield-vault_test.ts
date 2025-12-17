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
