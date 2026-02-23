import { http, createConfig, createStorage } from 'wagmi';
import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const polygonMainnet = defineChain({
  id: 137,
  name: 'Polygon',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://polygon-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
  },
});

export const polygonAmoy = defineChain({
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [polygonMainnet, polygonAmoy],
  connectors: [
    injected(),
  ],
  transports: {
    [polygonMainnet.id]: http(process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC || 'https://polygon-rpc.com'),
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology'),
  },
  ssr: true,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  }),
});

export const MUSIC_NFT_ADDRESS = process.env.NEXT_PUBLIC_MUSIC_NFT_ADDRESS || '0xb14505dF2954DdE7a0509C06F220d09b8EAC66Ae';
export const STREAMING_PAYMENT_ADDRESS = process.env.NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS || '0x04Dd347E800228Adb52B69D01d4643556d6AF219';
export const SUBSCRIPTION_ADDRESS = process.env.NEXT_PUBLIC_SUBSCRIPTION_ADDRESS || '0x712C3ed71019464A35ebD2A5FDF8AE2f7C2DAa3A';
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';
export const SOUNDCHAIN_V2_ADDRESS = process.env.NEXT_PUBLIC_SOUNDCHAIN_V2_ADDRESS || '0x33DD3D9f255E610e17cE840628B96f0E6C921417';

export const MUSIC_NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'ipfsHash', type: 'string' },
      { name: 'royaltyPercentage', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getTrackInfo',
    outputs: [
      { name: 'ipfsHash', type: 'string' },
      { name: 'artist', type: 'address' },
      { name: 'royaltyPercentage', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const STREAMING_PAYMENT_ABI = [
  {
    inputs: [
      { name: 'trackId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'payForStream',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'trackId', type: 'uint256' }],
    name: 'getStreamCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const SUBSCRIPTION_ABI = [
  {
    inputs: [{ name: 'duration', type: 'uint256' }],
    name: 'subscribe',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'isSubscribed',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getSubscriptionEnd',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const SOUNDCHAIN_V2_ABI = [
  {
    inputs: [
      { name: 'trackId', type: 'string' },
      { name: 'artist', type: 'address' },
    ],
    name: 'registerTrack',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'trackId', type: 'string' }],
    name: 'recordPlay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'trackId', type: 'string' }],
    name: 'tipArtist',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'trackId', type: 'string' }],
    name: 'getTrack',
    outputs: [
      { name: 'artist', type: 'address' },
      { name: 'totalPlays', type: 'uint256' },
      { name: 'totalTips', type: 'uint256' },
      { name: 'createdAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'artist', type: 'address' }],
    name: 'getArtist',
    outputs: [
      { name: 'totalEarnings', type: 'uint256' },
      { name: 'totalPlays', type: 'uint256' },
      { name: 'trackCount', type: 'uint256' },
      { name: 'tipCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalTracks',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalArtists',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    name: 'getTrackIds',
    outputs: [{ name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'trackId', type: 'string' },
    ],
    name: 'checkPlayed',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllArtists',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
