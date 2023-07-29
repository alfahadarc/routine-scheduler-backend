import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { connect } from './config/database.js'

const app = express()
const port = 3000


connect().then(
  (client) => {
    console.log(client);
  }
).catch(
  (error) => {
    console.log(error)
  }
)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})