require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const express = require('express')
const app = express()
const channels = require('./data.json')

app.use(cors())
app.get('/', (req, res) => {
    res.status(200).send('Yt api')
})

app.get('/channels', (req, res) => {
    res.status(200).send({
        data: channels
    })
})

app.get('/channels/:id', async (req, res) => {
    const key = process.env.KEY || ''
    const index = channels.findIndex(channel => channel.id == req.params.id)
    const channelId = channels[index].channelId

    const url = `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channelId}&part=snippet,id&order=date&maxResults=15`
    const result = await axios.get(url)

    const data = []
    result.data.items.forEach(item => {
        data.push({
            video_id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            published_at: item.snippet.publishedAt,
        })
    })

    res.status(200).send({ data })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))