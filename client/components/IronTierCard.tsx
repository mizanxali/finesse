import { Button, Card, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useNFTPort from '../hooks/useNFTPort';

const IronTierCard = ({
  artistImageURL,
  artistName,
  isLoading,
  artistAddress,
  setIsClaimingAnyTier
}: IIronTierCardProps) => {
  const { signerAddress, isConnected } = useAuth();

  const { mintNFTConcertTicket, mintArtistNFT } = useNFTPort();

  const [isIronTierClaimed, setIsIronTierClaimed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`${artistName}${signerAddress}irontier`))
      setIsIronTierClaimed(true);
  }, [artistName, signerAddress]);

  return (
    <div>
      <Card
        className="border-none h-full"
        css={{ height: '100%' }}
        variant="flat"
      >
        <Card.Header className="">Iron Tier - 10 coins</Card.Header>
        <Card.Body className="bg-iron">
          <Text weight="extrabold">Mint a personalized artist NFT.</Text>
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
                  <Button color="secondary" size="xs">
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
                  color="secondary"
                >
                  Claim
                </Button>
              )}
            </Card.Footer>
          )}
      </Card>
    </div>
  );
};

export default IronTierCard;

interface IIronTierCardProps {
  isLoading: boolean;
  artistName: string;
  artistImageURL: string;
  artistAddress: string;
  setIsClaimingAnyTier: any;
}
