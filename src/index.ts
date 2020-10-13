import express from "express"
// import { uploadSingle } from './uploadSingle'

const PORT = process.env.PORT || 5000
const app = express()
const releaseInfoSingle = require("./api/releaseInfo")
const artists = require('./api/artists')
// const crawler = require('./crawler')
// const uploadSingle = require('./uploadSingle')
// const test = require('./test')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next()
})

app.get("/api/v1/releaseInfo/single", releaseInfoSingle.single);

app.get("/api/v1/releaseInfo/album", releaseInfoSingle.album);

app.get("/api/v1/artists", artists.artists);

// app.get('/api/v1/singleCarwl', crawler.crawl)

// app.get('/api/v1/updateSingle', uploadSingle.uploadSingle)

// app.get('/api/v1/test', test.test)

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
