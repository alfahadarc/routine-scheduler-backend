import { connect } from '../config/database.js'


export async function getTemplate(key) {

    const query = 'SELECT * FROM configs WHERE key=$1'
    const values = [key]
    const client = await connect()
    const results = await client.query(query, values)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}
export async function getAllTeacherMail() {

    const query = 'SELECT initial, email FROM teachers'

    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}
