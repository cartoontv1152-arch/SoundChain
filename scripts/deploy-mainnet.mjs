import hre from "hardhat";

// Circle's native USDC on Polygon mainnet
const POLYGON_MAINNET_USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

async function main() {
  console.log("🚀 Starting deployment to Polygon Mainnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

  // 1. Deploy MusicNFT
  console.log("📀 Deploying MusicNFT...");
  const MusicNFT = await hre.ethers.getContractFactory("MusicNFT");
  const musicNFT = await MusicNFT.deploy();
  await musicNFT.waitForDeployment();
  const musicNFTAddress = await musicNFT.getAddress();
  console.log("✅ MusicNFT deployed to:", musicNFTAddress, "\n");

  // 2. Deploy StreamingPayment (USDC, MusicNFT)
  console.log("💰 Deploying StreamingPayment...");
  const StreamingPayment = await hre.ethers.getContractFactory("StreamingPayment");
  const streamingPayment = await StreamingPayment.deploy(POLYGON_MAINNET_USDC, musicNFTAddress);
  await streamingPayment.waitForDeployment();
  const streamingPaymentAddress = await streamingPayment.getAddress();
  console.log("✅ StreamingPayment deployed to:", streamingPaymentAddress, "\n");

  // 3. Deploy Subscription (USDC)
  console.log("🎫 Deploying Subscription...");
  const Subscription = await hre.ethers.getContractFactory("Subscription");
  const subscription = await Subscription.deploy(POLYGON_MAINNET_USDC);
  await subscription.waitForDeployment();
  const subscriptionAddress = await subscription.getAddress();
  console.log("✅ Subscription deployed to:", subscriptionAddress, "\n");

  // 4. Deploy SoundChainV2
  console.log("🎵 Deploying SoundChainV2...");
  const SoundChainV2 = await hre.ethers.getContractFactory("SoundChainV2");
  const soundChainV2 = await SoundChainV2.deploy();
  await soundChainV2.waitForDeployment();
  const soundChainV2Address = await soundChainV2.getAddress();
  console.log("✅ SoundChainV2 deployed to:", soundChainV2Address, "\n");

  console.log("🎉 Deployment Complete!\n");
  console.log("=".repeat(60));
  console.log("CONTRACT ADDRESSES (Polygon Mainnet):");
  console.log("=".repeat(60));
  console.log("MusicNFT:         ", musicNFTAddress);
  console.log("StreamingPayment: ", streamingPaymentAddress);
  console.log("Subscription:     ", subscriptionAddress);
  console.log("SoundChainV2:    ", soundChainV2Address);
  console.log("USDC Token:       ", POLYGON_MAINNET_USDC);
  console.log("=".repeat(60));

  console.log("\n📝 Add these to your .env file:");
  console.log(`NEXT_PUBLIC_MUSIC_NFT_ADDRESS=${musicNFTAddress}`);
  console.log(`NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS=${streamingPaymentAddress}`);
  console.log(`NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=${subscriptionAddress}`);
  console.log(`NEXT_PUBLIC_SOUNDCHAIN_V2_ADDRESS=${soundChainV2Address}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${POLYGON_MAINNET_USDC}`);

  console.log("\n⏳ Waiting for block confirmations...");
  await musicNFT.deploymentTransaction().wait(3);
  await streamingPayment.deploymentTransaction().wait(3);
  await subscription.deploymentTransaction().wait(3);
  await soundChainV2.deploymentTransaction().wait(3);

  console.log("\n✨ Done! Contracts are deployed on Polygon Mainnet.");
  console.log("   View on PolygonScan: https://polygonscan.com/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
