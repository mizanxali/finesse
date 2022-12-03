const hre = require("hardhat");

async function main() {
  // const DrakeHotlineBling = await hre.ethers.getContractFactory(
  //   "DrakeHotlineBling"
  // );
  // const drakeHotlineBling = await DrakeHotlineBling.deploy();
  // await drakeHotlineBling.deployed();
  // console.log("DrakeHotlineBling deployed at: ", drakeHotlineBling.address);

  // const DrakeInMyFeelings = await hre.ethers.getContractFactory(
  //   "DrakeInMyFeelings"
  // );
  // const drakeInMyFeelings = await DrakeInMyFeelings.deploy();
  // await drakeInMyFeelings.deployed();
  // console.log("DrakeInMyFeelings deployed at: ", drakeInMyFeelings.address);

  // const EminemLoseYourself = await hre.ethers.getContractFactory(
  //   "EminemLoseYourself"
  // );
  // const eminemLoseYourself = await EminemLoseYourself.deploy();
  // await eminemLoseYourself.deployed();
  // console.log("EminemLoseYourself deployed at: ", eminemLoseYourself.address);

  // const EminemRapGod = await hre.ethers.getContractFactory("EminemRapGod");
  // const eminemRapGod = await EminemRapGod.deploy();
  // await eminemRapGod.deployed();
  // console.log("EminemRapGod deployed at: ", eminemRapGod.address);

  // const TaylorSwiftBlankSpace = await hre.ethers.getContractFactory(
  //   "TaylorSwiftBlankSpace"
  // );
  // const taylorSwiftBlankSpace = await TaylorSwiftBlankSpace.deploy();
  // await taylorSwiftBlankSpace.deployed();
  // console.log(
  //   "TaylorSwiftBlankSpace deployed at: ",
  //   taylorSwiftBlankSpace.address
  // );

  // const TaylorSwiftShakeItOff = await hre.ethers.getContractFactory(
  //   "TaylorSwiftShakeItOff"
  // );
  // const taylorSwiftShakeItOff = await TaylorSwiftShakeItOff.deploy();
  // await taylorSwiftShakeItOff.deployed();
  // console.log(
  //   "TaylorSwiftShakeItOff deployed at: ",
  //   taylorSwiftShakeItOff.address
  // );

  const Discussions = await hre.ethers.getContractFactory("Discussions");
  const discussions = await Discussions.deploy(
    "0x69015912AA33720b842dCD6aC059Ed623F28d9f7"
  );
  await discussions.deployed();
  console.log("Discussions deployed at: ", discussions.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
