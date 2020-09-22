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

const crawl = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
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

    await browser.close();
}

crawl();