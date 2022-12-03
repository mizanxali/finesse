import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Text, Table, Button, Loading } from '@nextui-org/react';
import { ethers } from 'ethers';
import useUniswap from '../hooks/useUniswap';

import { SONG_ADDRESSES, SONG_CONTRACTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const ExchangeScreen = () => {
  const Router = useRouter();

  const { provider, signerAddress, getSigner, isConnected, getWalletAddress } =
    useAuth();

  const [songs, setSongs] = useState<ISong[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onLoad = async () => {
      setIsLoading(true);

      let tokenContract;

      const fetchedSongs: ISong[] = [];

      for await (const songAddr of SONG_ADDRESSES) {
        console.log(songAddr);

        tokenContract = new ethers.Contract(
          songAddr,
          SONG_CONTRACTS[SONG_ADDRESSES.indexOf(songAddr)].abi,
          provider
        );

        const title = await tokenContract.songName();
        const artist = await tokenContract.artistName();
        const geniusID = await tokenContract.geniusID();

        const res = await fetch(`/api/genius-song?geniusID=${geniusID}`);
        const data = await res.json();
        const coverImgURL = data.coverImgURL;

        // const spotPrice = await fetchSpotPrice(songAddr);

        const song: ISong = {
          address: songAddr,
          title,
          artist,
          coverImgURL: coverImgURL,
          spotPrice: 0
        };

        fetchedSongs.push(song);
      }

      console.log('done', fetchedSongs);

      setSongs([...fetchedSongs]);
      setIsLoading(false);
    };

    onLoad();
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Exchange | Finesse</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className="py-8 px-60">
        <Text h1 className="text-center" weight="bold">
          Welcome home, to the Finesse exchange.
        </Text>
        {isLoading ? (
          <div className="text-center">
            <Loading size="lg" color="secondary" />
          </div>
        ) : (
          <div className="mt-12">
            <Table>
              <Table.Header>
                <Table.Column>
                  <span className="invisible">COVER</span>
                </Table.Column>
                <Table.Column>SONG</Table.Column>
                <Table.Column>ARTIST</Table.Column>
                <Table.Column>
                  <span className="invisible">CTA</span>
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {songs.map((song, index) => {
                  return (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Image
                          alt="Song cover art"
                          width={40}
                          height={40}
                          src={song.coverImgURL}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Link href={`/song/${song.address}}`}>
                          <span className="text-white cursor-pointer hover:underline">
                            {song.title}
                          </span>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          color="secondary"
                          href={`/artist/${song.artist.replace(' ', '-')}`}
                        >
                          <span className="cursor-pointer hover:underline">
                            {song.artist}
                          </span>
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link href={`/song/${song.address}}`}>
                          <Button color="secondary" size="xs">
                            Trade
                          </Button>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeScreen;

interface ISong {
  address: string;
  title: string;
  artist: string;
  coverImgURL: string;
  spotPrice: number;
}
