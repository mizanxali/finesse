import { toast } from 'react-toastify';

export default function useNFTPort() {
  const mintNFTConcertTicket = async (
    artistName: string,
    artistImgURL: string,
    ownerAddress: string
  ) => {
    const nftImageURL = await generateConcertTicketImage(
      artistImgURL,
      ownerAddress
    );

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY as string
      },
      body: JSON.stringify({
        chain: 'polygon',
        name: `${artistName} Concert Ticket`,
        description: `Admit ONE exclusive entry to ${ownerAddress}.`,
        file_url: nftImageURL,
        mint_to_address: ownerAddress
      })
    };

    fetch('https://api.nftport.xyz/v0/mints/easy/urls', options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        localStorage.setItem(
          `${artistName}${ownerAddress}bronzetier`,
          nftImageURL
        );
        toast('Successfully minted NFT and claimed Bronze Tier Reward.');
      })
      .catch((err) => console.error(err));
  };

  const mintArtistNFT = async (
    artistName: string,
    artistImgURL: string,
    ownerAddress: string
  ) => {
    const nftImageURL = await generateArtistNFTImage(
      artistImgURL,
      ownerAddress,
      artistName
    );

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY as string
      },
      body: JSON.stringify({
        chain: 'polygon',
        name: `${artistName} NFT`,
        description: `Exclusive NFT certifying that ${ownerAddress} is a super-fan of ${artistName}.`,
        file_url: nftImageURL,
        mint_to_address: ownerAddress
      })
    };

    fetch('https://api.nftport.xyz/v0/mints/easy/urls', options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        localStorage.setItem(
          `${artistName}${ownerAddress}irontier`,
          nftImageURL
        );
        toast('Successfully minted NFT and claimed Iron Tier Reward.');
      })
      .catch((err) => console.error(err));
  };

  const generateConcertTicketImage = async (
    artistImgURL: string,
    ownerAddress: string
  ) => {
    var data = {
      template: process.env
        .NEXT_PUBLIC_BANNERBEAR_CONCERT_TICKET_TEMPLATE_ID as string,
      modifications: [
        {
          name: 'artist_image',
          image_url: artistImgURL
        },
        {
          name: 'owner_address',
          text: ownerAddress
        }
      ]
    };

    const response = await fetch('https://sync.api.bannerbear.com/v2/images', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BANNERBEAR_API_KEY}`
      }
    });

    const jsonData = await response.json();
    return jsonData.image_url;
  };

  const generateArtistNFTImage = async (
    artistImgURL: string,
    ownerAddress: string,
    artistName: string
  ) => {
    var data = {
      template: process.env
        .NEXT_PUBLIC_BANNERBEAR_ARTIST_NFT_TEMPLATE_ID as string,
      modifications: [
        {
          name: 'artist_image',
          image_url: artistImgURL
        },
        {
          name: 'owner_address',
          text: ownerAddress
        },
        {
          name: 'artist_name',
          text: artistName
        }
      ]
    };

    const response = await fetch('https://sync.api.bannerbear.com/v2/images', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BANNERBEAR_API_KEY}`
      }
    });

    const jsonData = await response.json();
    return jsonData.image_url;
  };

  return { mintNFTConcertTicket, mintArtistNFT };
}
