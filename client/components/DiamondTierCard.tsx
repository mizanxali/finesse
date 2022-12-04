import { Button, Card, Modal, Text, useModal } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { HuddleIframe, IframeConfig } from '@huddle01/huddle01-iframe';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const DiamondTierCard = ({
  artistAddress,
  artistName,
  isLoading
}: IDiamondTierCardProps) => {
  const Router = useRouter();
  const { query, isReady } = Router;

  const { signerAddress, isConnected } = useAuth();

  const {
    setVisible: setDiamondTierModalVisible,
    bindings: diamondTierModalBindings
  } = useModal();

  const [iframeConfig, setIFrameConfig] = useState<IframeConfig>({
    roomUrl: '',
    height: '800px',
    width: '100%',
    noBorder: false
  });

  useEffect(() => {
    if (!isReady) return;

    const newConfig = { ...iframeConfig };
    newConfig.roomUrl = `https://iframe.huddle01.com/${query.name}<->${signerAddress}`;
    setIFrameConfig({
      ...newConfig
    });
  }, [isReady]);

  return (
    <div>
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
      <Card
        className="border-none h-full"
        css={{ height: '100%' }}
        variant="flat"
      >
        <Card.Header className="">Diamond Tier - 500 coins</Card.Header>
        <Card.Body className="bg-diamond">
          <Text weight="extrabold">
            Get on a 15 minute video call with {artistName}.
          </Text>
        </Card.Body>
        {isConnected() && !isLoading && artistAddress != signerAddress && (
          <Card.Footer className="flex justify-end">
            <Button
              onClick={() => setDiamondTierModalVisible(true)}
              size="xs"
              color="secondary"
            >
              Claim
            </Button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default DiamondTierCard;

interface IDiamondTierCardProps {
  isLoading: boolean;
  artistName: string;
  artistAddress: string;
}
