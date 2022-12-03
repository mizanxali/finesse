import { ethers } from 'ethers';
import { abi as UniswapV3Factory } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

import { abi as DrakeHotlineBlingABI } from '../../artifacts/contracts/DrakeHotlineBling.sol/DrakeHotlineBling.json';

import { getAbi, getPoolImmutables } from '../utils';

export default function useUniswap() {
  const fetchSpotPrice = async (tokenAddress: string) => {
    const address0 = tokenAddress;
    const address1 = process.env.NEXT_PUBLIC_WMATIC_ADDRESS as string;
    const factoryAddress = process.env
      .NEXT_PUBLIC_UNISWAP_V3_FACTORY_ADDRESS as string;
    const quoterAddress = process.env
      .NEXT_PUBLIC_UNISWAP_QUOTER_ADDRESS as string;
    const inputAmount = 1;

    console.log(factoryAddress, quoterAddress, address1, address0);

    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );

    const factoryContract = new ethers.Contract(
      factoryAddress,
      UniswapV3Factory,
      provider
    );

    const poolAddress = await factoryContract.getPool(address0, address1, 3000);

    console.log(poolAddress);

    const poolContract = new ethers.Contract(
      poolAddress,
      IUniswapV3PoolABI,
      provider
    );

    const tokenAddress0 = await poolContract.token0();
    const tokenAddress1 = await poolContract.token1();

    const tokenAbi0 = DrakeHotlineBlingABI;
    const tokenAbi1 = await getAbi(tokenAddress0);

    const tokenContract0 = new ethers.Contract(
      tokenAddress0,
      tokenAbi0,
      provider
    );
    const tokenContract1 = new ethers.Contract(
      tokenAddress1,
      tokenAbi1,
      provider
    );

    console.log(tokenAddress0, tokenAddress1);

    const tokenDecimals0 = await tokenContract0.decimals();
    const tokenDecimals1 = await tokenContract1.decimals();

    const quoterContract = new ethers.Contract(
      quoterAddress,
      QuoterABI,
      provider
    );

    const immutables = await getPoolImmutables(poolContract);

    const amountIn = ethers.utils.parseUnits(
      inputAmount.toString(),
      tokenDecimals0
    );

    const quotedAmountOut =
      await quoterContract.callStatic.quoteExactInputSingle(
        immutables.token1,
        immutables.token0,
        immutables.fee,
        amountIn,
        0
      );

    const amountOut = ethers.utils.formatUnits(quotedAmountOut, tokenDecimals1);

    console.log(amountOut);

    return amountOut;
  };

  return { fetchSpotPrice };
}
