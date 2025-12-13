import hre from "hardhat";

async function main() {
  console.log("🚀 Starting deployment to Polygon Amoy...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy MusicNFT
  console.log("📀 Deploying MusicNFT...");
  const MusicNFT = await hre.ethers.getContractFactory("MusicNFT");
  const musicNFT = await MusicNFT.deploy();
  await musicNFT.waitForDeployment();
  const musicNFTAddress = await musicNFT.getAddress();
  console.log("✅ MusicNFT deployed to:", musicNFTAddress, "\n");

  // Mock USDC address on Polygon Amoy (you should use the real USDC testnet address)
  // For Polygon Amoy, there's no official USDC, so we'll need to deploy a mock or use a known testnet token
  const MOCK_USDC = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // Mock address - replace with real testnet USDC
  
  // Deploy StreamingPayment
  console.log("💰 Deploying StreamingPayment...");
  const StreamingPayment = await hre.ethers.getContractFactory("StreamingPayment");
  const streamingPayment = await StreamingPayment.deploy(MOCK_USDC, musicNFTAddress);
  await streamingPayment.waitForDeployment();
  const streamingPaymentAddress = await streamingPayment.getAddress();
  console.log("✅ StreamingPayment deployed to:", streamingPaymentAddress, "\n");

  // Deploy Subscription
  console.log("🎫 Deploying Subscription...");
  const Subscription = await hre.ethers.getContractFactory("Subscription");
  const subscription = await Subscription.deploy(MOCK_USDC);
  await subscription.waitForDeployment();
  const subscriptionAddress = await subscription.getAddress();
  console.log("✅ Subscription deployed to:", subscriptionAddress, "\n");

  console.log("🎉 Deployment Complete!\n");
  console.log("=".repeat(60));
  console.log("CONTRACT ADDRESSES:");
  console.log("=".repeat(60));
  console.log("MusicNFT:         ", musicNFTAddress);
  console.log("StreamingPayment: ", streamingPaymentAddress);
  console.log("Subscription:     ", subscriptionAddress);
  console.log("USDC Token:       ", MOCK_USDC);
  console.log("=".repeat(60));
  
  console.log("\n📝 Add these to your .env file:");
  console.log(`NEXT_PUBLIC_MUSIC_NFT_ADDRESS=${musicNFTAddress}`);
  console.log(`NEXT_PUBLIC_STREAMING_PAYMENT_ADDRESS=${streamingPaymentAddress}`);
  console.log(`NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=${subscriptionAddress}`);
  console.log(`NEXT_PUBLIC_USDC_ADDRESS=${MOCK_USDC}`);

  // Verify contracts on Polygonscan (optional)
  console.log("\n⏳ Waiting for block confirmations...");
  await musicNFT.deploymentTransaction().wait(5);
  await streamingPayment.deploymentTransaction().wait(5);
  await subscription.deploymentTransaction().wait(5);
  
  console.log("\n✨ Done! Contracts are deployed and ready to use.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
