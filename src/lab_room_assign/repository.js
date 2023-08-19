import { connect } from '../../config/database.js'


export const getAllRoom = async () => {

    const query = 'SELECT * FROM rooms WHERE type = 1';
    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}

export const getAllCourse = async () => {

    const query = 'SELECT * FROM courses WHERE type = 1';
    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}