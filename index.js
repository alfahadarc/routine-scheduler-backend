import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import baseRouter from './baseRoute.js'
import { connect } from './config/database.js'
import errorHandler from './config/error-handle.js'

const app = express()
const port = 8000

app.use(cors())

app.use(express.json());

app.use('/v1/api', baseRouter)

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})