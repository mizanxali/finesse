import { Button, Card, Text } from '@nextui-org/react';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import useWeb3Storage from '../hooks/useWeb3Storage';
import { toast } from 'react-toastify';

const SilverTierCard = ({
  isLoading,
  artistName,
  artistAddress,
  unreleasedSongURL
}: ISilverTierCardProps) => {
  const { signerAddress, isConnected } = useAuth();

  const { retrieveFile } = useWeb3Storage();

  async function playUnreleasedSong() {
    if (!unreleasedSongURL) {
      toast('Cannot play unreleased song, artist not verified on Finesse yet.');
      return;
    }

    const file = await retrieveFile(unreleasedSongURL);
    window.location.href = `ipfs://${file[0].cid}/${file[0].name}`;
  }

  return (
    <div>
      <Card
        className="border-none h-full"
        css={{ height: '100%' }}
        variant="flat"
      >
        <Card.Header className="">Silver Tier - 50 coins</Card.Header>
        <Card.Body className="bg-silver">
          <Text weight="extrabold">
            Listen to an exclusive unreleased song from {artistName}.
          </Text>
        </Card.Body>
        {isConnected() && !isLoading && artistAddress != signerAddress && (
          <Card.Footer className="flex justify-end">
            <Button color="secondary" onClick={playUnreleasedSong} size="xs">
              Claim
            </Button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default SilverTierCard;

interface ISilverTierCardProps {
  isLoading: boolean;
  artistName: string;
  artistAddress: string;
  unreleasedSongURL: string;
}
