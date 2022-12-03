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
      <div className="flex flex-row justify-between items-center bg-gray-dark text-white h-14">
        <Link color="secondary" href="/">
          <Text
            color="secondary"
            className="cursor-pointer my-1.5 hover:text-white mx-3 text-base md:text-lg font-semibold"
          >
            Finesse
          </Text>
        </Link>
        <Text
          color="secondary"
          onClick={toggleNavbar}
          className="md:hidden cursor-pointer font-semibold hover:text-white block text-2xl mx-3"
        >
          menu
        </Text>
      </div>
      <Link color="secondary" href="/exchange">
        <Text
          color="secondary"
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-white mx-3 text-base md:text-lg font-semibold"
        >
          Exchange
        </Text>
      </Link>
      <Link color="secondary" href="/artist/Drake">
        <Text
          color="secondary"
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-white mx-3 text-base md:text-lg font-semibold"
        >
          Drake
        </Text>
      </Link>
      <Link color="secondary" href="/artist/Taylor-Swift">
        <Text
          color="secondary"
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-white mx-3 text-base md:text-lg font-semibold"
        >
          Taylor Swift
        </Text>
      </Link>
      <Link color="secondary" href="/artist/Eminem">
        <Text
          color="secondary"
          onClick={toggleNavbar}
          className="cursor-pointer my-1.5 hover:text-white mx-3 text-base md:text-lg font-semibold"
        >
          Eminem
        </Text>
      </Link>
      {isConnected() ? (
        <div className="text-center">
          <Text color="secondary" h6>
            {signerAddress}
          </Text>
        </div>
      ) : (
        <Button color="gradient" size="sm" onClick={() => getSigner(provider)}>
          Connect Wallet
        </Button>
      )}
    </div>
  ) : (
    <div className="flex flex-row justify-between items-center bg-gray-dark text-white px-6 md:px-10 h-14 drop-shadow-md">
      <Link color="secondary" href="/">
        <Text
          color="secondary"
          className="cursor-pointer hover:text-white mx-3 text-base md:text-lg font-semibold"
        >
          Finesse
        </Text>
      </Link>
      <Text
        color="secondary"
        onClick={toggleNavbar}
        className="md:hidden cursor-pointer font-semibold hover:text-white block text-2xl mx-3"
      >
        menu
      </Text>
      <div className="hidden md:flex flex-row items-center">
        <Link color="secondary" href="/exchange">
          <Text
            color="secondary"
            className="cursor-pointer hover:text-white mx-3 text-base md:text-lg font-semibold"
          >
            Exchange
          </Text>
        </Link>
        <Link color="secondary" href="/artist/Drake">
          <Text
            color="secondary"
            className="cursor-pointer hover:text-white mx-3 text-base md:text-lg font-semibold"
          >
            Drake
          </Text>
        </Link>
        <Link color="secondary" href="/artist/Taylor-Swift">
          <Text
            color="secondary"
            className="cursor-pointer hover:text-white mx-3 text-base md:text-lg font-semibold"
          >
            Taylor Swift
          </Text>
        </Link>
        <Link color="secondary" href="/artist/Eminem">
          <Text
            color="secondary"
            className="cursor-pointer hover:text-white mx-3 text-base md:text-lg font-semibold"
          >
            Eminem
          </Text>
        </Link>
        {isConnected() ? (
          <div className="text-center">
            <Text color="secondary" h6>
              {signerAddress}
            </Text>
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
