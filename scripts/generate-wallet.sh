#!/bin/bash

# Stacks Wallet Generation Script
# This script helps generate Stacks wallet addresses for deployment

set -e

echo "=================================="
echo "Stacks Wallet Generator"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if @stacks/cli is installed
if ! command -v stx &> /dev/null; then
    echo -e "${YELLOW}⚠️  @stacks/cli is not installed${NC}"
    echo ""
    echo "To install, run:"
    echo "  npm install -g @stacks/cli"
    echo ""
    echo "Or visit: https://www.npmjs.com/package/@stacks/cli"
    echo ""
    exit 1
fi

# Ask for network
echo "Select network:"
echo "1) Testnet (ST addresses)"
echo "2) Mainnet (SP addresses)"
read -p "Enter choice (1 or 2): " network_choice

if [ "$network_choice" == "1" ]; then
    NETWORK="testnet"
    NETWORK_FLAG="-t"
    ADDRESS_PREFIX="ST"
elif [ "$network_choice" == "2" ]; then
    NETWORK="mainnet"
    NETWORK_FLAG=""
    ADDRESS_PREFIX="SP"
else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Generating $NETWORK wallet...${NC}"
echo ""

# Generate wallet
WALLET_FILE="${NETWORK}_wallet_$(date +%Y%m%d_%H%M%S).json"
stx make_keychain $NETWORK_FLAG > "$WALLET_FILE"

# Extract and display key information
ADDRESS=$(grep -o '"address":"[^"]*"' "$WALLET_FILE" | cut -d'"' -f4)
BTC_ADDRESS=$(grep -o '"btcAddress":"[^"]*"' "$WALLET_FILE" | cut -d'"' -f4)

echo "=================================="
echo -e "${GREEN}✅ Wallet Generated Successfully!${NC}"
echo "=================================="
echo ""
echo "Wallet file saved to: $WALLET_FILE"
echo ""
echo -e "${GREEN}Stacks Address:${NC} $ADDRESS"
echo -e "${GREEN}Bitcoin Address:${NC} $BTC_ADDRESS"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo "1. Your mnemonic is in $WALLET_FILE - KEEP IT SAFE!"
echo "2. NEVER share your mnemonic or private key"
echo "3. NEVER commit $WALLET_FILE to version control"
echo "4. Backup your mnemonic in a secure location"
echo ""

if [ "$NETWORK" == "testnet" ]; then
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Get testnet STX tokens:"
    echo "   https://explorer.hiro.so/sandbox/faucet?chain=testnet"
    echo ""
    echo "2. Add your address and request tokens: $ADDRESS"
    echo ""
    echo "3. Update settings/Testnet.toml with your mnemonic"
    echo ""
fi

echo "4. Check balance at:"
if [ "$NETWORK" == "testnet" ]; then
    echo "   https://explorer.hiro.so/address/${ADDRESS}?chain=testnet"
else
    echo "   https://explorer.hiro.so/address/${ADDRESS}"
fi
echo ""
echo "=================================="
