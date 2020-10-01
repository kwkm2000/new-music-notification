import { Request, Response } from 'express'
import fetch from 'node-fetch'


export const single = async (req: Request, res: Response) => {
  const response = await fetch('https://storage.googleapis.com/new-music-notification-01/singleReleaseInfo.json')
	const json = await response.json()
  res.json(json)
};

export const album = (req: Request, res: Response) => {
  res.json({
    message: "album",
  });
};
