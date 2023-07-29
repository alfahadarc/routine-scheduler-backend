import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import { connect } from './config/database.js'

const app = express()
const port = 3000

import './repository/user.js'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})