import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function genius(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { geniusID } = req.query;

  try {
    const response = await fetch(`https://api.genius.com/songs/${geniusID}`, {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`
      }
    });

    const data = await response.json();
    res.status(200).json({
      coverImgURL: data.response.song.song_art_image_url,
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}

type Data = {
  coverImgURL?: string;
  success: boolean;
};
