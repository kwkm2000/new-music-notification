
import puppeteer from 'puppeteer';
import fs from 'fs'


interface Artist {
    name: string
    imgSrc: string
}

const crawl = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    const url = 'http://j-lyric.net/artist/p1.html'
    const PAGE_MAX = 20
    const selector = {
        cell: ".bdy",
        dateHeading: "#content-main section .ttl-b"
    }
    let allArtists: Artist[] = []
    await page.goto(url, { waitUntil: 'networkidle0' })
    for (let i = 0; i < PAGE_MAX; i++) {
        if (i > 0) {
            const nextUrl = `http://j-lyric.net/artist/p${i + 1}.html`
            await page.goto(nextUrl, { waitUntil: 'networkidle0' })
        }
        const pageArtists = await page.evaluate((selector) => {
            const artists: Artist[] = []
            const cellElements = document.querySelectorAll(selector)
            Array.from(cellElements).forEach((sectionElement: HTMLElement) => {
                const nameSelector = '.mid a'
                const artistImageSelector = '.i6l'
                const nameElement = sectionElement.querySelector(nameSelector)
                if (!nameElement || !nameElement.textContent) {
                    return
                }
                const artistImageElement: HTMLImageElement | null = sectionElement.querySelector(artistImageSelector)
                if (!artistImageElement) {
                    return
                }
                artists.push({
                    name: nameElement.textContent,
                    imgSrc: artistImageElement.src
                })
            })
            return artists
        }, selector.cell)
        allArtists = [...allArtists, ...pageArtists]
    }

    fs.writeFileSync('./public/artists.json', JSON.stringify(allArtists))


    await browser.close();
}

crawl();