import { Text } from '@nextui-org/react';
import React from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { SONG_ADDRESSES, SONG_CONTRACTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import useWeb3Storage from '../hooks/useWeb3Storage';

const ArtistFileInput = ({ artistName }: IArtistFileInputProps) => {
  const { signer } = useAuth();

  const { storeFile } = useWeb3Storage();

  function openTrackInput() {
    var inputEl = document.getElementById('track-upload') as HTMLInputElement;
    inputEl.click();
  }

  async function onTrackUpload(e: any) {
    const file = e.target.files[0];
    const cid = await storeFile(file, artistName as string);

    // @ts-ignore
    const artistIndex = SONG_ARTISTS_KEYS.indexOf(query.name as string);

    const tokenContract = new ethers.Contract(
      SONG_ADDRESSES[artistIndex] as string,
      SONG_CONTRACTS[artistIndex].abi,
      signer
    );

    await tokenContract.updateUnreleasedSongURL(cid, {
      gasPrice: '1000000000'
    });

    toast('Track successfully uploaded!');
  }

  return (
    <div onClick={openTrackInput}>
      <input
        type="file"
        id="track-upload"
        className="w-full h-full hidden"
        accept="audio/*"
        onChange={onTrackUpload}
      />
      <Text color="secondary" h6 className="cursor-pointer hover:underline">
        Click here to upload your unreleased track for the Silver Tier.
      </Text>
    </div>
  );
};

export default ArtistFileInput;

interface IArtistFileInputProps {
  artistName: string;
}
