import { ethers } from 'ethers';

export const getAbi = async (address: string) => {
  const url = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY}`;

  const data = await fetch(url);
  const res = await data.json();
  const abi = res.result;

  return abi;
};

export const getPoolImmutables = async (poolContract: any) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee()
  ]);

  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee
  };

  return immutables;
};

export const formatSolidityTimestamp = (timestamp: any) => {
  const date = new Date(Number(ethers.utils.formatUnits(timestamp)));
  return timeDifference(new Date().getTime(), date.getTime());
};

function timeDifference(current: any, previous: any) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
  }
}
