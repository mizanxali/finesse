import {
  Button,
  Card,
  Loading,
  Modal,
  Text,
  useModal
} from '@nextui-org/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Player } from '@livepeer/react';
import { ethers } from 'ethers';
import { Chat } from '@pushprotocol/uiweb';
import { ToastContainer, toast } from 'react-toastify';
import { HuddleIframe, IframeConfig } from '@huddle01/huddle01-iframe';
import {
  ARTIST_GENIUS_IDs,
  SONG_ADDRESSES,
  SONG_ARTISTS_KEYS,
  SONG_CONTRACTS
} from '../constants';
import { useAuth } from '../context/AuthContext';
import useNFTPort from '../hooks/useNFTPort';
import useWalletBalance from '../hooks/useWalletBalance';
import useWeb3Storage from '../hooks/useWeb3Storage';
import Navbar from '../components/Navbar';

const ArtistScreen = () => {
  const Router = useRouter();
  const { query, isReady } = Router;

  const {
    signer,
    provider,
    signerAddress,
    getSigner,
    isConnected,
    getWalletAddress
  } = useAuth();

  const artistName = query.name?.toString().replace('-', ' ');

  const [artistImageURL, setArtistImageURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [artistHoldings, setArtistHoldings] = useState<IArtistHolding[]>([]);
  const [isIronTierClaimed, setIsIronTierClaimed] = useState(false);
  const [isBronzeTierClaimed, setIsBronzeTierClaimed] = useState(false);
  const [isSilverTierClaimed, setIsSilverTierClaimed] = useState(false);
  const [isGoldTierClaimed, setIsGoldTierClaimed] = useState(false);
  const [isPlatinumTierClaimed, setIsPlatinumTierClaimed] = useState(false);
  const [isDiamondTierClaimed, setIsDiamondTierClaimed] = useState(false);
  const [artistAddress, setArtistAddress] = useState('');
  const [isArtistVerified, setIsArtistVerified] = useState(false);
  const [isClaimingAnyTier, setIsClaimingAnyTier] = useState(false);
  const [unreleasedSongURL, setUnreleasedSongURL] = useState('');
  const [iframeConfig, setIFrameConfig] = useState<IframeConfig>({
    roomUrl: '',
    height: '800px',
    width: '100%',
    noBorder: false
  });

  const { fetchTokenBalance } = useWalletBalance();
  const { mintNFTConcertTicket, mintArtistNFT } = useNFTPort();
  const { storeFile, retrieveFile } = useWeb3Storage();

  const {
    setVisible: setGoldTierModalVisible,
    bindings: goldTierModalBindings
  } = useModal();

  const {
    setVisible: setDiamondTierModalVisible,
    bindings: diamondTierModalBindings
  } = useModal();

  useEffect(() => {
    if (!isReady) return;

    const newConfig = { ...iframeConfig };
    newConfig.roomUrl = `https://iframe.huddle01.com/${query.name}<->${signerAddress}`;
    setIFrameConfig({
      ...newConfig
    });

    const onLoad = async () => {
      const res = await fetch(
        // @ts-ignore
        `/api/genius-artist?geniusID=${ARTIST_GENIUS_IDs[query.name as string]}`
      );
      const data = await res.json();
      const imgURL = data.imgURL;

      setArtistImageURL(imgURL);

      // @ts-ignore
      const artistIndex = SONG_ARTISTS_KEYS.indexOf(query.name as string);

      const tokenContract = new ethers.Contract(
        SONG_ADDRESSES[artistIndex] as string,
        SONG_CONTRACTS[artistIndex].abi,
        provider
      );

      const _isArtistVerified = await tokenContract.isArtistVerified();
      const _artistAddress = await tokenContract.artistAddress();
      const _unreleasedSongURL = await tokenContract.unreleasedSongURL();

      console.log(_isArtistVerified, _artistAddress, _unreleasedSongURL);

      setIsArtistVerified(_isArtistVerified);
      setArtistAddress(_artistAddress);
      setUnreleasedSongURL(_unreleasedSongURL);
    };

    onLoad();
  }, [isReady]);

  useEffect(() => {
    if (localStorage.getItem(`${artistName}${signerAddress}irontier`))
      setIsIronTierClaimed(true);
    if (localStorage.getItem(`${artistName}${signerAddress}bronzetier`))
      setIsBronzeTierClaimed(true);
  }, [artistName, signerAddress]);

  useEffect(() => {
    if (!isReady || !signerAddress) return;

    const calculateHoldings = async () => {
      setIsLoading(true);

      let index = 0;
      const holdings = [];
      for await (const artistKey of SONG_ARTISTS_KEYS) {
        if (artistKey === query.name) {
          const [title, balance] = await fetchTokenBalance(
            SONG_ADDRESSES[index],
            SONG_CONTRACTS[index].abi,
            signerAddress
          );
          console.log(title, balance);

          const holding: IArtistHolding = {
            balance,
            title,
            address: SONG_ADDRESSES[index]
          };
          holdings.push(holding);
        }
        index++;
      }
      setArtistHoldings([...holdings]);
      setIsLoading(false);
    };

    calculateHoldings();
  }, [isReady, signerAddress]);

  function openChatBox() {
    if (!isArtistVerified) {
      toast('Cannot chat, artist not verified on Finesse yet.');
      return;
    }

    const chatButton = document.querySelector(
      '.chat__Button-sc-1nrfhfd-1'
    ) as HTMLElement;
    chatButton.click();
  }

  // const [clipFileUrl, setClipFileUrl] = useState<any>(null);

  function openTrackInput() {
    var inputEl = document.getElementById('track-upload') as HTMLInputElement;
    inputEl.click();
  }

  async function onTrackUpload(e: any) {
    const file = e.target.files[0];
    // const cid = await storeFile(file, artistName as string);
    const cid = 'bafybeihn2pbdo44xaktqm3mapllqa5lmujumgpb64md4qiowj632g7etze';

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

  async function playUnreleasedSong() {
    if (!unreleasedSongURL) {
      toast('Cannot play unreleased song, artist not verified on Finesse yet.');
      return;
    }

    const file = await retrieveFile(unreleasedSongURL);
    window.location.href = `ipfs://${file[0].cid}/${file[0].name}`;
  }

  return (
    <div className="min-h-screen py-8 px-24">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Head>
        <title>{artistName} | Finesse</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Modal scroll fullScreen closeButton {...diamondTierModalBindings}>
        <Modal.Header>
          <Text color="secondary" id="modal-title" size={18}>
            Video Call with {artistName}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <HuddleIframe config={iframeConfig} />
        </Modal.Body>
      </Modal>

      <Modal scroll fullScreen closeButton {...goldTierModalBindings}>
        <Modal.Header>
          <Text color="secondary" id="modal-title" size={18}>
            Live Stream by {artistName}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Player
            title="Drake Live Stream"
            playbackId="65b5ry3fu8o4fc3q"
            showPipButton
          />
        </Modal.Body>
      </Modal>

      {artistName && isArtistVerified && (
        <Chat
          modalTitle={`Chat with ${artistName}`}
          account={signerAddress} //user address
          supportAddress={artistAddress} //artist address
          apiKey={process.env.NEXT_PUBLIC_PUSH_CHAT_API_KEY}
          env="staging"
        />
      )}

      <div className="flex flex-row">
        <div className="w-3/4 px-12">
          <div className="flex flex-row">
            {artistImageURL && artistImageURL.length > 0 && (
              <div>
                <Image
                  alt="Artist photo"
                  src={artistImageURL}
                  width={120}
                  height={120}
                />
              </div>
            )}
            <div className="pl-10 flex-1">
              <Text color="secondary" h1>
                {artistName}
              </Text>
              {isArtistVerified && artistAddress == signerAddress && (
                <>
                  <Text color="secondary" h4>
                    This is you!
                  </Text>
                  {!unreleasedSongURL && (
                    <div onClick={openTrackInput}>
                      <input
                        type="file"
                        id="track-upload"
                        className="w-full h-full hidden"
                        accept="audio/*"
                        onChange={onTrackUpload}
                      />
                      <Text
                        color="secondary"
                        h6
                        className="cursor-pointer hover:underline"
                      >
                        Click here to upload your unreleased track for the
                        Silver Tier.
                      </Text>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-12">
            {isClaimingAnyTier ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-2 auto-rows-fr gap-6">
                <div className="">
                  <Card
                    className="border-none h-full"
                    css={{ height: '100%' }}
                    variant="flat"
                  >
                    <Card.Header className="">Iron Tier</Card.Header>
                    <Card.Body className="bg-iron">
                      <Text color="secondary">
                        Mint a personalized artist NFT.
                      </Text>
                    </Card.Body>
                    {isConnected() &&
                      !isLoading &&
                      artistName &&
                      artistAddress != signerAddress && (
                        <Card.Footer className="flex justify-end">
                          {isIronTierClaimed ? (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={
                                localStorage.getItem(
                                  `${artistName}${signerAddress}irontier`
                                ) as string
                              }
                            >
                              <Button color="gradient" size="xs">
                                View NFT
                              </Button>
                            </a>
                          ) : (
                            <Button
                              onClick={() => {
                                setIsClaimingAnyTier(true);
                                mintArtistNFT(
                                  artistName,
                                  artistImageURL,
                                  signerAddress
                                ).then(() => {
                                  setIsClaimingAnyTier(false);
                                  setIsIronTierClaimed(true);
                                });
                              }}
                              size="xs"
                              color="gradient"
                            >
                              Claim
                            </Button>
                          )}
                        </Card.Footer>
                      )}
                  </Card>
                </div>
                <div className="">
                  <Card
                    className="border-none h-full"
                    css={{ height: '100%' }}
                    variant="flat"
                  >
                    <Card.Header className="">Bronze Tier</Card.Header>
                    <Card.Body className="bg-bronze">
                      <Text color="secondary">
                        Mint one free NFT ticket to {artistName}'s next concert.
                      </Text>
                    </Card.Body>
                    {isConnected() &&
                      !isLoading &&
                      artistName &&
                      artistAddress != signerAddress && (
                        <Card.Footer className="flex justify-end">
                          {isBronzeTierClaimed ? (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={
                                localStorage.getItem(
                                  `${artistName}${signerAddress}bronzetier`
                                ) as string
                              }
                            >
                              <Button color="gradient" size="xs">
                                View NFT
                              </Button>
                            </a>
                          ) : (
                            <Button
                              color="gradient"
                              onClick={() => {
                                setIsClaimingAnyTier(true);
                                mintNFTConcertTicket(
                                  artistName,
                                  artistImageURL,
                                  signerAddress
                                ).then(() => {
                                  setIsClaimingAnyTier(false);
                                  setIsBronzeTierClaimed(true);
                                });
                              }}
                              size="xs"
                            >
                              Claim
                            </Button>
                          )}
                        </Card.Footer>
                      )}
                  </Card>
                </div>
                <div className="">
                  <Card
                    className="border-none h-full"
                    css={{ height: '100%' }}
                    variant="flat"
                  >
                    <Card.Header className="">Silver Tier</Card.Header>
                    <Card.Body className="bg-silver">
                      <Text color="secondary">
                        Listen to an exclusive unreleased song from {artistName}
                        .
                      </Text>
                    </Card.Body>
                    {isConnected() &&
                      !isLoading &&
                      artistAddress != signerAddress && (
                        <Card.Footer className="flex justify-end">
                          <Button
                            color="gradient"
                            onClick={playUnreleasedSong}
                            size="xs"
                          >
                            Claim
                          </Button>
                        </Card.Footer>
                      )}
                  </Card>
                </div>
                <div className="">
                  <Card
                    className="border-none h-full"
                    css={{ height: '100%' }}
                    variant="flat"
                  >
                    <Card.Header className="">Gold Tier</Card.Header>
                    <Card.Body className="bg-gold">
                      <Text color="secondary">
                        Get access to a special Gold tier holders-only live
                        stream from {artistName}.
                      </Text>
                    </Card.Body>
                    {isConnected() &&
                      !isLoading &&
                      artistAddress != signerAddress && (
                        <Card.Footer className="flex justify-end">
                          <Button
                            color="gradient"
                            onClick={() => setGoldTierModalVisible(true)}
                            size="xs"
                          >
                            Claim
                          </Button>
                        </Card.Footer>
                      )}
                  </Card>
                </div>
                <div className="">
                  <Card
                    className="border-none h-full"
                    css={{ height: '100%' }}
                    variant="flat"
                  >
                    <Card.Header className="">Platinum Tier</Card.Header>
                    <Card.Body className="bg-platinum">
                      <Text color="secondary">
                        Get to chat with {artistName} via text messaging.
                      </Text>
                    </Card.Body>
                    {isConnected() &&
                      !isLoading &&
                      artistAddress != signerAddress && (
                        <Card.Footer className="flex justify-end">
                          <Button
                            color="gradient"
                            onClick={openChatBox}
                            size="xs"
                          >
                            Claim
                          </Button>
                        </Card.Footer>
                      )}
                  </Card>
                </div>
                <div className="">
                  <Card
                    className="border-none h-full"
                    css={{ height: '100%' }}
                    variant="flat"
                  >
                    <Card.Header className="">Diamond Tier</Card.Header>
                    <Card.Body className="bg-diamond">
                      <Text color="secondary">
                        Get on a 15 minute video call with {artistName}.
                      </Text>
                    </Card.Body>
                    {isConnected() &&
                      !isLoading &&
                      artistAddress != signerAddress && (
                        <Card.Footer className="flex justify-end">
                          <Button
                            onClick={() => setDiamondTierModalVisible(true)}
                            size="xs"
                            color="gradient"
                          >
                            Claim
                          </Button>
                        </Card.Footer>
                      )}
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/4">
          <Text color="secondary" h4>
            Your holdings in {artistName}'s songs
          </Text>
          {isLoading ? (
            <Loading />
          ) : (
            artistHoldings.map((holding) => {
              return (
                <Text color="secondary" h6>
                  <Link color="secondary" href={`/song/${holding.address}`}>
                    <span className="cursor-pointer hover:underline">
                      {holding.title}
                    </span>
                  </Link>{' '}
                  - {holding.balance}
                </Text>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistScreen;

interface IArtistHolding {
  title: string;
  balance: number;
  address: string;
}
