import { ethers } from 'ethers';

export default function useWalletBalance() {
  const fetchTokenBalance = async (
    contractAddress: string,
    contractABI: any,
    signerAddress: string
  ) => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );

    const tokenContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const tokenName = await tokenContract.songName();
    const tokenBalance = await tokenContract.balanceOf(signerAddress);

    return [tokenName, Number(ethers.utils.formatEther(tokenBalance))];
  };

  return { fetchTokenBalance };
}
