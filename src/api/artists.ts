import { Request, Response } from 'express'
import artistsJson from '../../public/artists.json'
import fetch from 'node-fetch'

export const artists = async (req: Request, res: Response) => {
    const response = await fetch('https://storage.googleapis.com/new-music-notification-01/artists.json')
    const json = await response.json()
    res.json(json)
}

