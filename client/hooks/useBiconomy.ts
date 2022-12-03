import { ChainId } from '@biconomy/core-types';
import { ethers } from 'ethers';
import SmartAccount from '@biconomy/smart-account';
import { useAuth } from '../context/AuthContext';

import DiscussionsContract from '../../artifacts/contracts/Discussions.sol/Discussions.json';

export let activeChainId = ChainId.POLYGON_MUMBAI;
export const supportedChains = [
  ChainId.GOERLI,
  ChainId.POLYGON_MAINNET,
  ChainId.POLYGON_MUMBAI
];

export default function useBiconomy() {
  const { provider, signerAddress, getSigner, isConnected, getWalletAddress } =
    useAuth();

  const postDiscussion = async (songAddress: string, text: string) => {
    let options = {
      activeNetworkId: activeChainId,
      supportedNetworksIds: supportedChains,

      networkConfig: [
        {
          chainId: ChainId.POLYGON_MUMBAI,
          dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY
        }
      ]
    };

    let smartAccount = new SmartAccount(provider, options);
    smartAccount = await smartAccount.init();

    const tokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DISCUSSIONS_CONTRACT_ADDRESS as string,
      DiscussionsContract.abi,
      provider
    );

    const data = tokenContract.interface.encodeFunctionData('postDiscussion', [
      songAddress,
      text
    ]);

    const tx1 = {
      to: process.env.NEXT_PUBLIC_DISCUSSIONS_CONTRACT_ADDRESS as string,
      data
    };

    const txResponse = await smartAccount.sendGasLessTransaction({
      transaction: tx1
    });

    console.log(txResponse);
  };

  const fetchDiscussions = async (songAddress: string) => {
    const tokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DISCUSSIONS_CONTRACT_ADDRESS as string,
      DiscussionsContract.abi,
      provider
    );

    const discussions = await tokenContract.getSongDiscussions(songAddress);
    return discussions;
  };

  return { postDiscussion, fetchDiscussions };
}

// await tokenContract.postDiscussion('songAddress', 'hello world')
