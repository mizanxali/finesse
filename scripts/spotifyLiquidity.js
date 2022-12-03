//sample script to demonstrate increase in liquidity of token on the basis of the song's popularity
//token tested in this script - EminemRapGod (contracts/EminemRapGod.sol)

const { ethers } = require("ethers");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

require("dotenv").config();

async function main() {
  //fetch song views from Genius API
  const geniusSongViews = await fetchGeniusSongViews();

  const quotient = parseInt(geniusSongViews / 100000);

  //add 0.001 MATIC to pool for every 100k song views
  const weiToPutInPool = 1000000000000000 * quotient;

  await increaseLiquidityOfUniswapPosition(weiToPutInPool);
}

async function increaseLiquidityOfUniswapPosition(weiToPutInPool) {
  const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
  const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
  const WALLET_SECRET = process.env.PRIVATE_KEY;

  const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  );

  const nonFungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    provider
  );

  const wallet = new ethers.Wallet(WALLET_SECRET);
  const connectedWallet = wallet.connect(provider);
  nonFungiblePositionManagerContract
    .connect(connectedWallet)
    .positions("6899")
    .then((res) => {
      const totalLiquidity = res.liquidity;

      const params = {
        tokenId: 6899,
        liquidity: totalLiquidity + weiToPutInPool,
        amount0Min: 0,
        amount1Min: 0,
        amount0Desired: 10,
        amount1Desired: 10,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      };

      nonFungiblePositionManagerContract
        .connect(connectedWallet)
        .increaseLiquidity(params, { gasLimit: ethers.utils.hexlify(1000000) })
        .then((res2) => {
          console.log(res2);
        });
    });
}

async function fetchGeniusSongViews() {
  const response = await fetch(`https://api.genius.com/songs/235729`, {
    headers: {
      Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
    },
  });

  const data = await response.json();

  return data.response.song.stats.pageviews;
}

main();
