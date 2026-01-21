import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [polygonAmoy.id]: http(process.env.POLYGON_AMOY_RPC),
  },
});

export const MUSIC_NFT_ADDRESS = process.env.NEXT_PUBLIC_MUSIC_NFT_ADDRESS || '0xb14505dF2954DdE7a0509C06F220d09b8EAC66Ae';
export const STREAMING_PAYMENT_ADDRESS = process.env.NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS || '0x04Dd347E800228Adb52B69D01d4643556d6AF219';
export const SUBSCRIPTION_ADDRESS = process.env.NEXT_PUBLIC_SUBSCRIPTION_ADDRESS || '0x712C3ed71019464A35ebD2A5FDF8AE2f7C2DAa3A';
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582';

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
