# 🎵 SoundChain - Decentralized Music Streaming Platform

A revolutionary blockchain-powered music streaming platform that enables artists to upload, monetize, and earn directly from their music while fans enjoy decentralized streaming with cryptocurrency payments.

![SoundChain](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Polygon](https://img.shields.io/badge/Polygon-Amoy-8247E5?logo=polygon)
![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?logo=ipfs)

## Update in this Wave

### Wagmi & Web3 Stack Overhaul
- Downgraded from **wagmi v3** (unstable) to **wagmi v2.14.16** with matching **@wagmi/core v2.16.7** and **viem v2.21.58** for full compatibility
- Added **@tanstack/react-query** as required peer dependency for wagmi v2
- Created `src/components/Providers.tsx` — wraps the entire app with `WagmiProvider` + `QueryClientProvider` (was completely missing before)
- Updated `src/app/layout.tsx` to wrap children with `<Providers>`
- Fixed `defineChain` import — moved from `wagmi/chains` to `viem` where it actually exists
- Configured wagmi `createStorage` with `noopStorage` to prevent `indexedDB is not defined` SSR crashes
- Added `next.config.ts` webpack ignore plugin for optional wagmi connector peer deps (`@wallet-connect/ethereum-provider`, `@coinbase/wallet-sdk`, etc.)

### API Route Fixes
- **Added POST handler to `/api/artists`** — was completely missing, causing "Unexpected end of JSON input" when creating artist profiles. Now supports artist creation with `walletAddress`, `artistName`, `bio`, `genres`, `avatar`, and `socialLinks`
- **Added wallet-based GET query** to `/api/artists?wallet=0x...` — artist dashboard can now fetch artist profile by wallet address
- Fixed `src/app/api/search/route.ts` — Artist model field mapping (`artistName` -> `displayName`, `avatar` -> `avatarUrl`)
- Fixed Artist import — changed from default import to named import `{ Artist }` matching the model export
- **Fixed `/api/tracks` GET** — added `artistAddress` query filter so artist dashboard can fetch only their own tracks
- **Fixed `/api/upload` route** — now stores `artistAddress` from form data on the track document
- **Fixed `/api/earnings/withdraw` route** — corrected function call from non-existent `createShiftOrder` to actual `createShift` from sideshift.ts

### Component Fixes
- Fixed `src/components/Sidebar.tsx` — added missing `toast` import from `sonner` and `BecomeArtistDialog` import
- Fixed `src/components/TipDialog.tsx` — uses `SOUNDCHAIN_V2_ADDRESS` and `SOUNDCHAIN_V2_ABI` from web3-config for on-chain tipping
- **Fixed `BecomeArtistDialog.tsx`** — added proper error handling for fetch responses; no longer crashes with "Unexpected end of JSON input" on non-JSON error responses
- **Fixed `src/app/artist/page.tsx`** — replaced broken `window.ethereum.selectedAddress` with wagmi's `useAccount` hook for reliable wallet detection; added safe JSON parsing on all fetch calls

### Model Fixes
- Made `userId` optional in `Artist` model — wallet-based auth doesn't require a separate User document to create an artist

### Build & Deploy Fixes
- Removed unused `@web3modal/wagmi` dependency — was causing ERESOLVE peer dependency conflicts on Vercel deploy (needed `@wagmi/core@3.x` but we use `2.x`)
- Added `.npmrc` with `legacy-peer-deps=true` for robust npm installs on Vercel
- Removed `--turbopack` flag from dev script — turbopack has a bug in Next.js 15 where `prerender-manifest.json` is not generated, causing all API routes to return 500
- Added `skipLibCheck: true` and explicit `types` array in `tsconfig.json` to resolve phantom `@types/minimatch` errors
- Full `tsc --noEmit` passes with zero errors

### Deployed Smart Contract Addresses (Polygon Amoy Testnet)

| Contract | Address |
|---|---|
| **MusicNFT** | `0xb14505dF2954DdE7a0509C06F220d09b8EAC66Ae` |
| **StreamingPayment** | `0x04Dd347E800228Adb52B69D01d4643556d6AF219` |
| **Subscription** | `0x712C3ed71019464A35ebD2A5FDF8AE2f7C2DAa3A` |
| **USDC Token** | `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582` |
| **SoundChain V2** | `0x33DD3D9f255E610e17cE840628B96f0E6C921417` |

> All contracts are deployed on **Polygon Amoy Testnet** (Chain ID: 80002). View on [Amoy PolygonScan](https://amoy.polygonscan.com/).

---

## 🌟 What is SoundChain?

SoundChain is a fully decentralized music streaming platform that revolutionizes how artists earn and how fans discover music. By leveraging blockchain technology, IPFS storage, and cryptocurrency payments, we create a transparent, fair, and direct connection between artists and listeners.




### Key Features

- **🎨 For Artists**
  - Upload music directly to IPFS via Pinata
  - Mint tracks as NFTs on Polygon blockchain
  - Earn 90%+ of all streaming revenue
  - Real-time analytics dashboard
  - Withdraw earnings to any crypto via SideShift
  - Set custom pricing per stream

- **🎧 For Listeners**
  - Stream unlimited music with crypto wallet
  - Support artists directly with each stream
  - Discover new music by genre, trending, or search
  - Create and manage playlists
  - Like and save favorite tracks

- **⛓️ Blockchain Integration**
  - ERC-721 NFT standard for music tracks
  - Polygon Amoy testnet for fast, low-cost transactions
  - Transparent on-chain payment records
  - Smart contract-based royalty distribution

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 15 (App Router), React 18, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB Atlas
- **Blockchain**: Solidity, Hardhat, Polygon Amoy, Ethers.js
- **Storage**: IPFS (Pinata), MongoDB
- **Payments**: SideShift API for crypto withdrawals
- **Auth**: Web3 wallet connection (MetaMask, WalletConnect)

### Smart Contracts

1. **MusicNFT.sol** (`0xb14505dF2954DdE7a0509C06F220d09b8EAC66Ae`)
   - ERC-721 NFT contract for music tracks
   - Stores metadata and ownership information
   - Handles minting and transfers

2. **StreamingPayment.sol** (`0x04Dd347E800228Adb52B69D01d4643556d6AF219`)
   - Manages per-stream payments in USDC
   - Calculates and distributes artist earnings
   - Records stream analytics on-chain

3. **Subscription.sol** (`0x712C3ed71019464A35ebD2A5FDF8AE2f7C2DAa3A`)
   - Handles monthly subscription payments
   - Manages subscriber access and benefits
   - Automatic renewal logic

4. **USDC Token** (`0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`)
   - Polygon Amoy USDC token contract
   - Used for all platform payments

### How SideShift Integration Works

SideShift API enables artists to withdraw their earnings to any cryptocurrency:

1. Artist earns USDC from streams (stored in MongoDB)
2. Artist initiates withdrawal via dashboard
3. Platform uses SideShift API to convert USDC → any crypto
4. SideShift handles the conversion and sends to artist's wallet
5. Artist receives earnings in their preferred cryptocurrency

**SideShift Configuration:**
- `SIDESHIFT_SECRET`: API secret for authenticated requests
- `SIDESHIFT_AFFILIATE_ID`: Platform affiliate ID for tracking

### How Polygon Amoy Works

Polygon Amoy is a testnet that provides:
- Fast block times (~2 seconds)
- Low transaction fees (<$0.01)
- Full EVM compatibility
- Perfect for testing before mainnet deployment

**Network Details:**
- RPC URL: `https://polygon-amoy.g.alchemy.com/v2/...`
- Chain ID: 80002
- Explorer: https://amoy.polygonscan.com/

### Data Flow

1. **Artist Upload**:
   ```
   Artist uploads audio file → Pinata IPFS → Get IPFS hash
   → Store metadata in MongoDB → Mint NFT on Polygon → Artist dashboard
   ```

2. **User Stream**:
   ```
   User plays track → Check wallet connection → Record stream
   → Update analytics in MongoDB → Calculate payment → Store earnings
   → Display in artist dashboard
   ```

3. **Artist Withdrawal**:
   ```
   Artist requests withdrawal → Fetch available balance from MongoDB
   → Call SideShift API → Convert USDC to selected crypto
   → Transfer to artist wallet → Update MongoDB records
   ```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB Atlas account
- Pinata account (IPFS)
- Polygon Amoy testnet wallet with test MATIC
- MetaMask or Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd soundchain
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Configure environment variables**

Create `.env` file with:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Pinata IPFS
PINATA_API_KEY=your_api_key
PINATA_SECRET_KEY=your_secret_key

# Polygon Amoy
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/...
PRIVATE_KEY=your_wallet_private_key

# Smart Contracts (Deployed on Polygon Amoy)
NEXT_PUBLIC_MUSIC_NFT_ADDRESS=0xb14505dF2954DdE7a0509C06F220d09b8EAC66Ae
NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS=0x04Dd347E800228Adb52B69D01d4643556d6AF219
NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=0x712C3ed71019464A35ebD2A5FDF8AE2f7C2DAa3A
NEXT_PUBLIC_USDC_ADDRESS=0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id

# SideShift (Crypto Conversion)
SIDESHIFT_SECRET=your_secret
SIDESHIFT_AFFILIATE_ID=your_affiliate_id

# Gemini AI (Optional - for recommendations)
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Testing APIs

Run the comprehensive API test suite:

```bash
./test-api.ps1
```

This tests all 16 endpoints including:
- Track CRUD operations
- Artist management
- User authentication
- Analytics tracking
- Payment processing
- Earnings calculations

## 📚 API Documentation

### Tracks
- `GET /api/tracks` - Get all tracks (with filters, search, pagination)
- `POST /api/tracks` - Create new track
- `GET /api/tracks/[id]` - Get track by ID
- `POST /api/tracks/stream` - Record a stream

### Artists
- `GET /api/artists` - Get all artists or by wallet
- `POST /api/artists` - Create new artist profile

### Users
- `GET /api/users` - Get user by wallet
- `POST /api/users` - Create new user

### Analytics
- `GET /api/analytics` - Get analytics (overall or by artist)

### Earnings
- `GET /api/earnings` - Get artist earnings
- `POST /api/earnings/withdraw` - Withdraw earnings via SideShift

### Payments
- `POST /api/payments` - Record stream payment

### Upload
- `POST /api/upload` - Upload music to IPFS and create track

### Recommendations
- `GET /api/recommendations` - Get AI-powered music recommendations

## 🎨 User Guide

### For Artists

1. **Connect Wallet**: Click "Connect Wallet" in sidebar
2. **Become Artist**: Click "Become an Artist" and fill in profile
3. **Upload Music**:
   - Select audio file (MP3, WAV, FLAC)
   - Add cover art (PNG, JPG)
   - Enter track details (title, genre, description)
   - Set streaming price (default: $0.001 per stream)
   - Click "Upload & Mint NFT"
4. **Monitor Analytics**: View streams, earnings, and listener stats
5. **Withdraw Earnings**: Convert to any crypto and withdraw

### For Listeners

1. **Connect Wallet**: Required to play music
2. **Discover Music**: Browse by genre, trending, or search
3. **Play Tracks**: Click play button (requires wallet connection)
4. **Create Playlists**: Save favorite tracks
5. **Support Artists**: Each 30+ second stream pays artist directly

## 💰 Revenue Model

- Artists set price per stream (default: $0.001 USDC)
- Minimum stream duration: 30 seconds
- Artist share: 90%+
- Platform fee: <10%
- Payments in USDC on Polygon
- Instant payouts to artists

## 🔒 Security

- All user data encrypted in MongoDB
- Private keys never stored on server
- Smart contracts audited and tested
- IPFS ensures content permanence
- Web3 wallet authentication only

## 🛠️ Smart Contract Deployment

To deploy contracts to Polygon Amoy:

```bash
cd contracts-deploy
bun install
bunx hardhat run scripts/deploy.mjs --network polygonAmoy
```

See `DEPLOYMENT.md` for detailed instructions.

## 📊 Database Schema

### Collections

- **users**: Wallet addresses, preferences, isArtist flag
- **artists**: Artist profiles, bio, genres, social links
- **tracks**: Track metadata, IPFS hashes, pricing, NFT token IDs
- **streamAnalytics**: Play counts, duration, timestamps
- **earnings**: Artist earnings per stream, withdrawal history
- **playlists**: User-created playlists and saved tracks

## 🎯 Roadmap

- [x] Basic streaming functionality
- [x] Artist dashboard with analytics
- [x] IPFS integration via Pinata
- [x] MongoDB data storage
- [x] Smart contract deployment
- [x] SideShift withdrawal integration
- [ ] Mainnet deployment (Polygon)
- [ ] Mobile app (React Native)
- [ ] Social features (comments, shares)
- [ ] Live streaming support
- [ ] Artist collaboration tools
- [ ] NFT marketplace for tracks

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **Documentation**: See `USER_GUIDE.md`, `IMPLEMENTATION_SUMMARY.md`
- **Smart Contracts**: `contracts/` directory
- **API Tests**: `test-api.ps1`
- **Polygon Amoy Explorer**: https://amoy.polygonscan.com/

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team
- Check documentation files in the repo

---

**Built with ❤️ using Next.js, Polygon, IPFS, and MongoDB**
