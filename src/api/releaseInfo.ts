import { Request, Response } from "express";
import fetch from "node-fetch";
import { env } from "process";
import singleJSON from "../../public/singleReleaseInfo.json";
import albumJSON from "../../public/albumReleaseInfo.json";

export const single = async (req: Request, res: Response) => {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "develop") {
    res.json(singleJSON);
  } else {
    const response = await fetch(
      "https://storage.googleapis.com/new-music-notification-01/singleReleaseInfo.json"
    );
    const json = await response.json();
    res.json(json);
  }
};

export const album = async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "develop") {
    res.json(albumJSON);
  } else {
    const response = await fetch(
      "https://storage.googleapis.com/new-music-notification-01/albumReleaseInfo.json"
    );
    const json = await response.json();
    res.json(json);
  }
  res.json({
    message: "album",
  });
};
