import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function genius(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { geniusID } = req.query;

  console.log(geniusID);

  try {
    const response = await fetch(`https://api.genius.com/artists/${geniusID}`, {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`
      }
    });

    const data = await response.json();
    res.status(200).json({
      imgURL: data.response.artist.image_url,
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}

type Data = {
  imgURL?: string;
  success: boolean;
};
