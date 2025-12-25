#!/bin/bash

# Yield Vault Frontend Deployment Script
# For Week 3 Builder Challenge

echo "🚀 Yield Vault Frontend Deployment Script"
echo "========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm --version)"
echo ""

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi
echo ""

# Build the application
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi
echo ""

# Create deployment info
print_status "Creating deployment info..."
cat > build/deployment-info.json << EOF
{
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "contractAddress": "ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault",
  "network": "testnet",
  "walletConnectProjectId": "973aec75d9c96397c8ccd94d62bada81",
  "features": {
    "walletKitSDK": true,
    "reownAppKit": true,
    "chainhooks": true,
    "clarityV4": true
  },
  "builderChallenge": {
    "week2": ["Hiro Chainhooks", "User Tracking", "Fee Generation"],
    "week3": ["WalletKit SDK", "Reown AppKit", "Enhanced Metrics"]
  }
}
EOF

print_success "Deployment info created"
echo ""

# Optional: Deploy to various platforms
print_status "Deployment options:"
echo ""
echo "1. Deploy to Vercel:"
echo "   npx vercel --prod"
echo ""
echo "2. Deploy to Netlify:"
echo "   npx netlify deploy --prod --dir=build"
echo ""
echo "3. Deploy to GitHub Pages:"
echo "   npm run deploy"
echo ""
echo "4. Serve locally:"
echo "   npx serve -s build"
echo ""

# Show build summary
print_status "Build Summary:"
echo "=============="
echo "📁 Build directory: ./build"
echo "📊 Build size: $(du -sh build | cut -f1)"
echo "📝 Files: $(find build -type f | wc -l)"
echo ""

# Show Week 3 Challenge metrics
print_success "Week 3 Builder Challenge Features:"
echo "===================================="
echo "✅ WalletKit SDK Integration"
echo "✅ Reown AppKit Integration"
echo "✅ Multi-wallet Support"
echo "✅ User & Fee Tracking"
echo "✅ WalletConnect Project ID: 973aec75d9c96397c8ccd94d62bada81"
echo ""

print_success "Frontend ready for deployment!"
echo ""
echo "🔗 Contract Address: ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault"
echo "🌐 Network: Stacks Testnet"
echo "📱 Frontend: React 18.2.0 with Stacks Connect"
echo ""