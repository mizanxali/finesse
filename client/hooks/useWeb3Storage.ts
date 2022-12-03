import { Web3Storage } from 'web3.storage';

export default function useWeb3Storage() {
  const makeStorageClient = () => {
    return new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY as string
    });
  };

  const storeFile = async (file: File, artistName: string) => {
    const client = makeStorageClient();
    const cid = await client.put([file], {
      name: `${artistName} Unreleased Track`
    });
    console.log('stored file with cid:', cid);
    return cid;
  };

  const retrieveFile = async (cid: string) => {
    const client = makeStorageClient();
    const res = await client.get(cid);
    if (!res || !res.ok) throw new Error(`failed to get ${cid}`);
    const files = await res.files();
    return files;
  };

  return { storeFile, retrieveFile };
}
