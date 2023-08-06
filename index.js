import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import router from './router.js';
import { connect } from './config/database.js';
import errorHandler from './config/error-handle.js';

const app = express();
const port = process.env.PORT || 8000;


app.use(cors())

app.use(express.json());
app.use(cors());
app.use("/v1", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Routine Scheduler listening on port ${port}`);
});
