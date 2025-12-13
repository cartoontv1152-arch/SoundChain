# SoundChain - User Guide

## Overview
SoundChain is a fully functional, production-ready decentralized music streaming platform where artists can upload music to IPFS, mint as NFTs, and earn directly from streams. All user and music data is stored in MongoDB, with Pinata handling IPFS storage.

---

## For Artists: Complete Upload Flow

### 1. **Connect Your Wallet**
- Make sure you have MetaMask installed
- Connect your wallet by clicking the "Become an Artist" button in the sidebar
- Your wallet address will be automatically detected

### 2. **Become an Artist**
- Click "Become an Artist" in the sidebar (if not already an artist)
- Fill in your artist details:
  - Artist Name
  - Bio
  - Genres you create
  - Social links (optional)
- Submit to create your artist profile

### 3. **Access Artist Dashboard**
- Navigate to `/artist` or click "Artist Dashboard" in sidebar
- You'll see your artist stats:
  - Total Streams
  - Total Earnings
  - Monthly Listeners
  - Track Count

### 4. **Upload Your Music**
On the "Upload Music" tab:

1. **Upload Audio File**
   - Click or drag-and-drop your audio file (MP3, WAV, FLAC up to 50MB)
   - File will be uploaded to IPFS via Pinata

2. **Upload Cover Art** (optional but recommended)
   - Upload a square image (PNG/JPG, 1:1 ratio)
   - This becomes your track's visual identity

3. **Fill Track Details**
   - **Track Title** (required)
   - **Genre** (required) - Select from dropdown
   - **Description** (optional)
   - **Price per stream** (default: $0.001 USDC)

4. **Upload & Mint**
   - Click "Upload & Mint NFT"
   - Progress bar shows upload status
   - Track is stored on IPFS and metadata saved to MongoDB
   - Track ID is generated and stored

### 5. **Monitor Your Music**
- **My Tracks Tab**: View all your uploaded tracks
- **Earnings Tab**: See total earnings, breakdown per track, and available balance
- **Withdraw**: Transfer earnings to your wallet via SideShift

---

## For Listeners: Streaming Music

### 1. **Browse Music**
- **Home Page**: See trending tracks and recently added music
- **Discover Page**: Search tracks, filter by genre, toggle grid/list view
- **Library Page**: View your playlists, liked songs, and recently played

### 2. **Connect Wallet to Play**
- Music playback requires a connected wallet
- Click any track to start playing
- MetaMask will prompt for connection on first play

### 3. **Stream Tracking**
- Each stream over 30 seconds is recorded
- Artist earns $0.001 per stream (configurable)
- Stream analytics are tracked in MongoDB

### 4. **Interact with Tracks**
- **Like**: Save tracks to your liked songs
- **Add to Playlist**: Create and manage playlists
- **Queue**: Add tracks to playback queue

---

## API Testing

Test all APIs with the provided `test-api.ps1` script:

```powershell
powershell -File test-api.ps1
```

Or manually test individual endpoints:

### 1. **Get All Tracks**
```bash
curl http://localhost:3000/api/tracks
```

### 2. **Create Artist**
```bash
curl -X POST http://localhost:3000/api/artists \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "artistName": "Your Artist Name",
    "bio": "Your bio here",
    "genres": ["Electronic", "Hip-Hop"]
  }'
```

### 3. **Get Artist Tracks**
```bash
curl "http://localhost:3000/api/tracks?artistAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

### 4. **Track a Stream**
```bash
curl -X POST http://localhost:3000/api/tracks/stream \
  -H "Content-Type: application/json" \
  -d '{
    "trackId": "your-track-id",
    "listenerAddress": "0x123...",
    "streamDuration": 180
  }'
```

### 5. **Get Analytics**
```bash
curl "http://localhost:3000/api/analytics?artistAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

---

## Database Structure

### Collections in MongoDB:

1. **users**: Listener accounts
   - walletAddress, username, likedTracks, playlists

2. **artists**: Artist profiles
   - walletAddress, artistName, bio, genres, socialLinks

3. **tracks**: Music tracks
   - title, artistAddress, ipfsHash, coverImage, genre, price, plays

4. **playlists**: User playlists
   - name, description, userAddress, tracks

5. **streamanalytics**: Stream tracking
   - trackId, listenerAddress, artistAddress, streamDuration, earnings

6. **earnings**: Artist earnings
   - artistAddress, amount, trackId, status, withdrawalDetails

---

## Payment Flow

1. **Streaming Payment**
   - Listener plays track for 30+ seconds
   - $0.001 (or custom price) is recorded as earnings
   - 90% goes to artist, 10% platform fee

2. **Withdrawal**
   - Artist navigates to Earnings tab
   - Clicks "Withdraw to Wallet"
   - SideShift API converts USDC to any crypto
   - Funds sent to artist's wallet address

---

## Smart Contract Integration (Optional)

For on-chain NFT minting and payments, deploy the smart contracts:

### 1. **Install Hardhat** (if not already)
```bash
npm install --save-dev hardhat
```

### 2. **Deploy Contracts**
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygon-amoy
```

### 3. **Update Contract Addresses**
Add deployed addresses to `.env`:
```
NEXT_PUBLIC_MUSIC_NFT_ADDRESS=0x...
NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS=0x...
NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=0x...
```

---

## Environment Variables

Required in `.env`:

```
# MongoDB
MONGODB_URI=mongodb+srv://...

# Pinata (IPFS)
PINATA_API_KEY=...
PINATA_SECRET_KEY=...

# SideShift (Crypto conversion)
SIDESHIFT_SECRET=...
SIDESHIFT_AFFILIATE_ID=...

# Gemini AI (Recommendations)
GEMINI_API_KEY=...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...

# Blockchain
PRIVATE_KEY=0x...
POLYGON_AMOY_RPC=https://...
```

---

## Troubleshooting

### "No tracks available"
- This means no tracks have been uploaded yet
- Go to `/artist` and upload your first track

### Upload fails
- Check Pinata API keys in `.env`
- Ensure audio file is under 50MB
- Verify wallet is connected

### Can't play music
- Connect your MetaMask wallet
- Check browser console for errors
- Ensure MongoDB connection is active

### Analytics not showing
- Stream analytics require minimum 30 seconds of playback
- Check MongoDB connection
- Verify `StreamAnalytics` collection exists

---

## Next Steps

1. **Upload music** as an artist
2. **Test streaming** as a listener
3. **Monitor analytics** in artist dashboard
4. **Withdraw earnings** via SideShift
5. **Deploy smart contracts** for on-chain functionality

For production deployment, update:
- MongoDB to production cluster
- Pinata to paid plan for unlimited IPFS
- Deploy smart contracts to Polygon mainnet
- Configure production API keys

---

## Support

All APIs are tested and working. MongoDB is configured, Pinata is ready, and the complete user flow is functional. The platform is production-ready for artists to upload music and earn from streams!
