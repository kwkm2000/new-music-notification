import {Request, Response} from 'express'
import artistsJson from '../../public/artists.json'

export const artists = (req: Request, res: Response) => {
    res.json(artistsJson)
}

