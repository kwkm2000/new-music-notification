import express from "express"
// import { uploadSingle } from './uploadSingle'

const PORT = process.env.PORT || 5000
const app = express()
import { single, album } from "./api/releaseInfo"
import { artists } from './api/artists'
import { uploadSingle } from './uploadSingle'


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next()
})

app.get("/api/v1/releaseInfo/single", single);

app.get("/api/v1/releaseInfo/album", album);

app.get("/api/v1/artists", artists);

app.get('/api/v1/updateSingle', uploadSingle)

// app.get('/api/v1/test', test.test)

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
