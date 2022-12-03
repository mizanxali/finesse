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
