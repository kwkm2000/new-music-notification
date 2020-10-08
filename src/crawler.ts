import { Request, Response, NextFunction } from 'express'
import puppeteer from 'puppeteer';
import fs from 'fs'

interface ReleaseInfo {
    title: string
    artist: string
    imgSrc: string
    price: string
}

interface ReleaseInfoList {
    [key: string]: ReleaseInfo[]
}

async function scrollToBottom(page: puppeteer.Page, viewportHeight: number) {
    const getScrollHeight = () => {
        return Promise.resolve(document.documentElement.scrollHeight)
    }

    let scrollHeight = await page.evaluate(getScrollHeight)
    let currentPosition = 0
    let scrollNumber = 0

    while (currentPosition < scrollHeight) {
        scrollNumber += 1
        const nextPosition = scrollNumber * viewportHeight
        await page.evaluate(function (scrollTo) {
            return Promise.resolve(window.scrollTo(0, scrollTo))
        }, nextPosition)


        currentPosition = nextPosition;

        // 2
        scrollHeight = await page.evaluate(getScrollHeight)
    }
}
const crawl = async () => {
    console.log('crawl start')
    const viewportHeight = 1200
    const viewportWidth = 1600
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    page.setViewport({ width: viewportWidth, height: viewportHeight })
    const url = 'https://www.oricon.co.jp/release/single/jp/'
    const PAGE_MAX = 12
    const selector = {
        section: "#content-main section",
        dateHeading: "#content-main section .ttl-b"
    }
    let releaseInfoObj = {}
    await page.goto(url, { waitUntil: 'networkidle0' })


    for (let i = 0; i < PAGE_MAX; i++) {
        if (i > 0) {
            const nextUrl = `https://www.oricon.co.jp/release/single/jp/p/${i}/`
            await page.goto(nextUrl, { waitUntil: 'networkidle0' })
        }

        await scrollToBottom(page, viewportHeight)
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
        .catch(e => console.log('timeout exceed. proceed to next operation'))

        const result = await page.evaluate((selector) => {
            let releaseInfoObject: ReleaseInfoList = {}
            const sectionElements = document.querySelectorAll(selector)

            Array.from(sectionElements).forEach((sectionElement: HTMLElement) => {
                const titleSelector = '.ttl-b'
                const dateTitleElement = sectionElement.querySelector(titleSelector)
                if (!dateTitleElement) {
                    return
                }
                const dateTitle = dateTitleElement.textContent
                if (!dateTitle) {
                    return
                }
                const formattedTitle = dateTitle.replace('年', '/').replace('月', '/').replace('日', '').replace(' 発売', '')
                const listElement = sectionElement.querySelector('.block-relese-list');
                if (!listElement) {
                    return
                }
                const items = Array.from(listElement.querySelectorAll('.jsc-block-ranking-detail'))

                releaseInfoObject[formattedTitle] = []
                releaseInfoObject[formattedTitle] = items.map((item: any): ReleaseInfo => {
                    return {
                        title: item.querySelector('.title').textContent,
                        artist: item.querySelector('.artist').textContent,
                        imgSrc: item.querySelector('.jacket').getAttribute('src'),
                        price: item.querySelector('.cell-price').textContent,
                    }
                })
            })

            return releaseInfoObject
        }, selector.section)

        releaseInfoObj = { ...releaseInfoObj, ...result }
        fs.writeFileSync('./public/singleReleaseInfo.json', JSON.stringify(releaseInfoObj))
    }
    console.log('crawl end')
    await browser.close();
}

crawl()
