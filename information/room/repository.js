import { connect } from '../../config/database.js'


export async function getAll() {

    const query = 'SELECT * FROM rooms';
    try {
        const client = await connect()
        const results = await client.query(query)

        if (results.rows.length <= 0) {
            throw new Error("Table is empty");
        } else {
            client.release();
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}

export async function saveRoom(rooms) {

    const room = rooms.room
    const type = rooms.type


    const query = 'INSERT INTO rooms (room, type) VALUES ($1, $2)';
    const values = [room, type]
    try {
        const client = await connect()
        const results = await client.query(query, values)

        if (results.rowCount <= 0) {
            throw new Error("not saved");
        } else {
            client.release();
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}

export async function updateRoom(rooms) {


    const type = rooms.type
    const room = rooms.room


    const query = `
    UPDATE rooms
  SET
    type = $2
  WHERE room = $1
  `
    const values = [room, type]
    try {
        const client = await connect()
        const results = await client.query(query, values)

        if (results.rowCount <= 0) {
            throw new Error("error");
        } else {
            client.release();
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}

export async function removeRoom(room) {


    const query = `
    DELETE FROM rooms
    WHERE room = $1
  `
    const values = [room]
    try {
        const client = await connect()
        const results = await client.query(query, values)

        if (results.rowCount <= 0) {
            throw new Error("error");
        } else {
            client.release();
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}