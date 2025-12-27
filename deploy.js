const { makeContractDeploy, broadcastTransaction, AnchorMode, privateKeyToAddress } = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');
const { generateWallet } = require('@stacks/wallet-sdk');
const fs = require('fs');
require('dotenv').config();

// Configuration from .env
const network = STACKS_TESTNET;
const mnemonic = process.env.MNEMONIC;
const contractName = "yield-vault";

// Validate environment variables
if (!mnemonic) {
  console.error("❌ ERROR: MNEMONIC not found in .env file");
  process.exit(1);
}

async function deployContract() {
  console.log("🚀 DEPLOYING YIELD-VAULT CONTRACT");
  console.log("=".repeat(60));

  // Read contract
  const contractSource = fs.readFileSync('contracts/yield-vault.clar', 'utf8');
  console.log(`✅ Contract loaded: ${contractSource.length} bytes`);

  try {
    // Generate wallet from mnemonic
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password: ''
    });

    const account = wallet.accounts[0];
    const senderKey = account.stxPrivateKey;

    // Derive testnet address from private key
    const senderAddress = privateKeyToAddress(senderKey);

    console.log(`📍 Deployer: ${senderAddress}`);

    // Get nonce
    const response = await fetch(`https://api.testnet.hiro.so/v2/accounts/${senderAddress}?proof=0`);
    const accountInfo = await response.json();
    const nonce = accountInfo.nonce;

    console.log(`🔢 Nonce: ${nonce}`);

    // Create transaction
    const txOptions = {
      contractName,
      codeBody: contractSource,
      senderKey,
      network,
      anchorMode: AnchorMode.Any,
      fee: 200000n, // 0.2 STX
      nonce: BigInt(nonce)
    };

    console.log("📝 Creating transaction...");
    const transaction = await makeContractDeploy(txOptions);

    console.log("📡 Broadcasting transaction...");
    const broadcastResponse = await broadcastTransaction({transaction, network});

    const txId = broadcastResponse.txid || broadcastResponse;

    console.log("");
    console.log("=".repeat(60));
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(60));
    console.log(`Transaction ID: ${txId}`);
    console.log(`Explorer: https://explorer.hiro.so/txid/${txId}?chain=testnet`);
    console.log(`Contract: https://explorer.hiro.so/txid/${senderAddress}.${contractName}?chain=testnet`);
    console.log("=".repeat(60));

    // Save deployment info
    const deploymentInfo = {
      txId,
      contractName,
      deployer: senderAddress,
      network: "testnet",
      timestamp: new Date().toISOString(),
      explorerUrl: `https://explorer.hiro.so/txid/${txId}?chain=testnet`,
      contractUrl: `https://explorer.hiro.so/txid/${senderAddress}.${contractName}?chain=testnet`
    };

    fs.writeFileSync('DEPLOYMENT-SUCCESS.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("\n✅ Deployment info saved to: DEPLOYMENT-SUCCESS.json");

  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED:");
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

deployContract();
