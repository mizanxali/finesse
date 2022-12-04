import { Player } from '@livepeer/react';
import { Button, Card, Modal, Text, useModal } from '@nextui-org/react';
import { useAuth } from '../context/AuthContext';

const GoldTierCard = ({
  isLoading,
  artistName,
  artistAddress
}: IGoldTierCardProps) => {
  const { signerAddress, isConnected } = useAuth();

  const {
    setVisible: setGoldTierModalVisible,
    bindings: goldTierModalBindings
  } = useModal();

  return (
    <div>
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
      <Card
        className="border-none h-full"
        css={{ height: '100%' }}
        variant="flat"
      >
        <Card.Header className="">Gold Tier - 100 coins</Card.Header>
        <Card.Body className="bg-gold">
          <Text weight="extrabold">
            Get access to a special Gold tier holders-only live stream from{' '}
            {artistName}.
          </Text>
        </Card.Body>
        {isConnected() && !isLoading && artistAddress != signerAddress && (
          <Card.Footer className="flex justify-end">
            <Button
              color="secondary"
              onClick={() => setGoldTierModalVisible(true)}
              size="xs"
            >
              Claim
            </Button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default GoldTierCard;

interface IGoldTierCardProps {
  isLoading: boolean;
  artistName: string;
  artistAddress: string;
}
