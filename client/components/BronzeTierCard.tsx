import { Button, Card, Text } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useNFTPort from '../hooks/useNFTPort';

const BronzeTierCard = ({
  artistImageURL,
  artistName,
  isLoading,
  artistAddress,
  setIsClaimingAnyTier
}: IBronzeTierCardProps) => {
  const { signerAddress, isConnected } = useAuth();

  const { mintNFTConcertTicket, mintArtistNFT } = useNFTPort();

  const [isBronzeTierClaimed, setIsBronzeTierClaimed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`${artistName}${signerAddress}bronzetier`))
      setIsBronzeTierClaimed(true);
  }, [artistName, signerAddress]);

  return (
    <div className="">
      <Card
        className="border-none h-full"
        css={{ height: '100%' }}
        variant="flat"
      >
        <Card.Header className="">Bronze Tier - 25 coins</Card.Header>
        <Card.Body className="bg-bronze">
          <Text weight="extrabold">
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
                  <Button color="secondary" size="xs">
                    View NFT
                  </Button>
                </a>
              ) : (
                <Button
                  color="secondary"
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
  );
};

export default BronzeTierCard;

interface IBronzeTierCardProps {
  isLoading: boolean;
  artistName: string;
  artistImageURL: string;
  artistAddress: string;
  setIsClaimingAnyTier: any;
}
