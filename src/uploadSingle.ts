import { Request, Response } from 'express'
import { crawl } from './crawler'
import { upload } from './uploadJson'

export function uploadSingle(req: Request, res: Response) {
    crawl()
    upload()
}