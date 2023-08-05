import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import baseRouter from './baseRoute.js'
import { connect } from './config/database.js'

const app = express()
const port = 3000

import './repository/user.js'
app.use(express.json());

app.use('/v1/api', baseRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})