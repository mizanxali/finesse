import { Button, Card, Text } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { Chat } from '@pushprotocol/uiweb';
import { useAuth } from '../context/AuthContext';

const PlatinumTierCard = ({
  artistAddress,
  artistName,
  isLoading,
  isArtistVerified
}: IPlatinumTierCardProps) => {
  const { signerAddress, isConnected } = useAuth();

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

  return (
    <div>
      {artistName && isArtistVerified && (
        <Chat
          modalTitle={`Chat with ${artistName}`}
          account={signerAddress} //user address
          supportAddress={artistAddress} //artist address
          apiKey={process.env.NEXT_PUBLIC_PUSH_CHAT_API_KEY}
          env="staging"
        />
      )}
      <Card
        className="border-none h-full"
        css={{ height: '100%' }}
        variant="flat"
      >
        <Card.Header className="">Platinum Tier - 250 coins</Card.Header>
        <Card.Body className="bg-platinum">
          <Text weight="extrabold">
            Get to chat with {artistName} via text messaging.
          </Text>
        </Card.Body>
        {isConnected() && !isLoading && artistAddress != signerAddress && (
          <Card.Footer className="flex justify-end">
            <Button color="secondary" onClick={openChatBox} size="xs">
              Claim
            </Button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default PlatinumTierCard;

interface IPlatinumTierCardProps {
  isLoading: boolean;
  artistName: string;
  artistAddress: string;
  isArtistVerified: boolean;
}
