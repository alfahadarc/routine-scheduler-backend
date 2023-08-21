import { connect } from '../../config/database.js'


export async function getAll() {

    const query = 'SELECT * FROM rooms';

    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        new Error("Table is empty")
    } else {
        client.release();
        return results.rows;
    }


}

export async function saveRoom(rooms) {

    const room = rooms.room
    const type = rooms.type


    const query = 'INSERT INTO rooms (room, type) VALUES ($1, $2)';
    const values = [room, type]

        const client = await connect()
        const results = await client.query(query, values)

        if (results.rowCount <= 0) {
            new Error("Insertion Failed")
        } else {
            client.release();
            return results.rows;
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

        const client = await connect()
        const results = await client.query(query, values)

        if (results.rowCount <= 0) {
            new Error("Update Failed")
        } else {
            client.release();
            return results.rows;
        }

}

export async function removeRoom(room) {


    const query = `
    DELETE FROM rooms
    WHERE room = $1
  `
    const values = [room]

        const client = await connect()
        const results = await client.query(query, values)

        if (results.rowCount <= 0) {
            new Error("Delete Failed")
        } else {
            client.release();
            return results.rows;
        }

}