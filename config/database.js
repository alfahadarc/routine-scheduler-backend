import dotenv from 'dotenv'
dotenv.config()
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.CONNECTION_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
})

const connect = async () => {
    return await pool.connect()
}

export { connect }
