import { Request, Response } from 'express'
import singleReleaseJson from '../../public/singleReleaseInfo.json'

export const single = (req: Request, res: Response) => {
  res.json(singleReleaseJson);
};

export const album = (req: Request, res: Response) => {
  res.json({
    message: "album",
  });
};
