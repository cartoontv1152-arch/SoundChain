import hre from "hardhat";

async function main() {
  console.log("Starting SoundChainV2 deployment to Polygon Amoy...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "POL\n");

  // Deploy SoundChainV2
  console.log("Deploying SoundChainV2...");
  const SoundChainV2 = await hre.ethers.getContractFactory("SoundChainV2");
  const soundChain = await SoundChainV2.deploy();
  await soundChain.waitForDeployment();
  const soundChainAddress = await soundChain.getAddress();
  console.log("SoundChainV2 deployed to:", soundChainAddress);

  console.log("\nWaiting for confirmations...");
  await soundChain.deploymentTransaction().wait(3);

  console.log("\n============================");
  console.log("DEPLOYMENT COMPLETE");
  console.log("============================");
  console.log("SoundChainV2:", soundChainAddress);
  console.log(`\nNEXT_PUBLIC_SOUNDCHAIN_V2_ADDRESS=${soundChainAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
