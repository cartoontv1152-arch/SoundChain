# SoundChain Deployment Guide

This guide covers deploying SoundChain smart contracts to **Polygon Mainnet**.

## Prerequisites

- **Node.js 18+** or Bun
- **MATIC** in your deployer wallet for gas (estimate: ~0.5–2 MATIC for all contracts)
- **Private key** for the deployer wallet (never commit to git)
- **RPC URL** for Polygon mainnet (e.g., from [Alchemy](https://alchemy.com) or [Infura](https://infura.io))

## Environment Variables

Create or update your `.env` file in the project root:

```env
# Required for deployment
PRIVATE_KEY=0x...                    # Deployer wallet private key
POLYGON_MAINNET_RPC=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Required for frontend (add after deployment)
NEXT_PUBLIC_POLYGON_MAINNET_RPC=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_MUSIC_NFT_ADDRESS=0x...
NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS=0x...
NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=0x...
NEXT_PUBLIC_SOUNDCHAIN_V2_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359

# Pinata (for IPFS uploads) - matches NEXT_PUBLIC_PINATA_* naming
PINATA_API_KEY=your_api_key
PINATA_SECRET_API_KEY=your_secret_key

# Other (MongoDB, WalletConnect, etc.)
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

## Step-by-Step Mainnet Deployment

### 1. Install Dependencies

```bash
cd contracts-deploy
npm install
# or: bun install
```

### 2. Verify Wallet Balance

Ensure your deployer wallet has MATIC on Polygon mainnet. Check at [polygonscan.com](https://polygonscan.com).

### 3. Deploy All Contracts

From the `contracts-deploy` directory:

```bash
bunx hardhat run scripts/deploy-mainnet.mjs --network polygonMainnet
```

Or using npm:

```bash
npm run deploy:mainnet
```

This deploys, in order:

1. **MusicNFT** – ERC-721 for music tracks  
2. **StreamingPayment** – Per-stream USDC payments (uses Circle’s native USDC)  
3. **Subscription** – Monthly subscription logic  
4. **SoundChainV2** – Track registration, play tracking, tipping  

### 4. Update .env with Contract Addresses

The script prints the deployed addresses. Add them to your `.env`:

```env
NEXT_PUBLIC_MUSIC_NFT_ADDRESS=<printed address>
NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS=<printed address>
NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=<printed address>
NEXT_PUBLIC_SOUNDCHAIN_V2_ADDRESS=<printed address>
NEXT_PUBLIC_USDC_ADDRESS=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
```

### 5. Restart the Next.js App

```bash
cd ..
npm run dev
# or: bun dev
```

## Verifying Contracts on PolygonScan

1. Go to [polygonscan.com](https://polygonscan.com)
2. Search for each contract address
3. On the contract page, open the **Contract** tab → **Verify & Publish**
4. Use Hardhat’s verification plugin:

```bash
npx hardhat verify --network polygonMainnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example for StreamingPayment (replace with your addresses):

```bash
npx hardhat verify --network polygonMainnet 0xYourStreamingPaymentAddress "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" "0xYourMusicNFTAddress"
```

## Polygon Amoy (Testnet) Deployment

For testnet:

```bash
cd contracts-deploy
bunx hardhat run scripts/deploy.mjs --network polygonAmoy
```

Ensure `.env` has `POLYGON_AMOY_RPC` and `PRIVATE_KEY`.

## Troubleshooting

### Insufficient funds

- **Error**: `insufficient funds for gas`
- **Fix**: Add MATIC to your deployer wallet on Polygon mainnet.

### RPC errors

- **Error**: `could not detect network` or `ECONNREFUSED`
- **Fix**: Check `POLYGON_MAINNET_RPC` is valid and reachable. Use a provider like Alchemy or Infura.

### Pinata upload fails

- **Error**: `Pinata upload failed`
- **Fix**: Set `PINATA_API_KEY` and `PINATA_SECRET_KEY` (or `NEXT_PUBLIC_PINATA_API_KEY` and `NEXT_PUBLIC_PINATA_SECRET_API_KEY`) in `.env`.

### Contract verification fails

- **Fix**: Ensure constructor arguments match exactly. For `StreamingPayment` and `Subscription`, the first arg is USDC address; `StreamingPayment` also needs the MusicNFT address.

## USDC on Polygon Mainnet

The deployment uses Circle’s native USDC:

- **Address**: `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
- **Decimals**: 6  
- **Explorer**: [PolygonScan](https://polygonscan.com/token/0x3c499c542cef5e3811e1192ce70d8cc03d5c3359)

Users need USDC to pay for streams and subscriptions.
