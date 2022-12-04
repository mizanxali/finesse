import { Button, Text } from '@nextui-org/react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const {
    signer,
    provider,
    signerAddress,
    getSigner,
    isConnected,
    getWalletAddress
  } = useAuth();

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  function toggleNavbar() {
    setIsNavbarExpanded(!isNavbarExpanded);
  }

  return isNavbarExpanded ? (
    <div className="flex flex-col bg-gray-dark px-6 drop-shadow-md pb-2">
      <div className="flex flex-row justify-between items-center bg-gray-dark text-diamond h-14">
        <Link href="/">
          <Text className="cursor-pointer my-1.5 hover:text-diamond mx-3 text-base md:text-lg font-semibold">
            Finesse
          </Text>
        </Link>
        <Text
          onClick={toggleNavbar}
          className="md:hidden cursor-pointer font-semibold hover:text-diamond block text-2xl mx-3"
        >
          menu
        </Text>
      </div>
      <Link href="/exchange">
        <Text
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-diamond mx-3 text-base md:text-lg font-semibold"
        >
          Exchange
        </Text>
      </Link>
      <Link href="/artist/Drake">
        <Text
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-diamond mx-3 text-base md:text-lg font-semibold"
        >
          Drake
        </Text>
      </Link>
      <Link href="/artist/Taylor-Swift">
        <Text
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-diamond mx-3 text-base md:text-lg font-semibold"
        >
          Taylor Swift
        </Text>
      </Link>
      <Link href="/artist/Eminem">
        <Text
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-diamond mx-3 text-base md:text-lg font-semibold"
        >
          Eminem
        </Text>
      </Link>
      {isConnected() && signerAddress ? (
        <div className="text-center">
          <Text h6>{`${signerAddress.slice(0, 4)}...${signerAddress.slice(
            -4
          )}`}</Text>
        </div>
      ) : (
        <Button color="gradient" size="sm" onClick={() => getSigner(provider)}>
          Connect Wallet
        </Button>
      )}
    </div>
  ) : (
    <div className="flex flex-row justify-between items-center bg-gray-dark text-diamond px-6 md:px-10 h-14 drop-shadow-md">
      <Link href="/">
        <Text className="cursor-pointer hover:text-diamond mx-3 text-base md:text-lg font-semibold">
          Finesse
        </Text>
      </Link>
      <Text
        onClick={toggleNavbar}
        className="md:hidden cursor-pointer font-semibold hover:text-diamond block text-2xl mx-3"
      >
        menu
      </Text>
      <div className="hidden md:flex flex-row items-center">
        <Link href="/exchange">
          <Text className="cursor-pointer hover:text-diamond mx-3 text-base md:text-lg font-semibold">
            Exchange
          </Text>
        </Link>
        <Link href="/artist/Drake">
          <Text className="cursor-pointer hover:text-diamond mx-3 text-base md:text-lg font-semibold">
            Drake
          </Text>
        </Link>
        <Link href="/artist/Taylor-Swift">
          <Text className="cursor-pointer hover:text-diamond mx-3 text-base md:text-lg font-semibold">
            Taylor Swift
          </Text>
        </Link>
        <Link href="/artist/Eminem">
          <Text className="cursor-pointer hover:text-diamond mx-3 text-base md:text-lg font-semibold">
            Eminem
          </Text>
        </Link>
        {isConnected() && signerAddress ? (
          <div className="text-center">
            <Text h6 className="m-0 p-0">{`${signerAddress.slice(
              0,
              4
            )}...${signerAddress.slice(-4)}`}</Text>
          </div>
        ) : (
          <Button
            color="gradient"
            size="sm"
            onClick={() => getSigner(provider)}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
