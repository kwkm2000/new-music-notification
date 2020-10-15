import { NextFunction, Request, Response } from 'express'
import { crawl } from './crawler/crawler'
import { upload } from './uploadJson'

export const  uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    console.log('uploadSingle')
    await crawl('single')
    upload()
    next();
}