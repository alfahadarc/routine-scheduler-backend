import { connect } from '../../config/database.js'


export async function getAll() {

    const query = 'SELECT * FROM sections';
    try {
        const client = await connect()
        const results = await client.query(query)

        if (results.rows.length <= 0) {
            throw new Error("Table is empty");
        } else {
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}

export async function saveSection(sections) {

    const batch = sections.batch
    const section = sections.section
    const type = sections.type
    const room = sections.room
    const session = sections.session

    const query = 'INSERT INTO sections (batch, section,type,room,session) VALUES ($1, $2, $3, $4, $5)';
    const values = [batch, section, type, room, session]
    try {
        const client = await connect()
        const results = await client.query(query, values)

        if (results.rows.length <= 0) {
            throw new Error("Table is empty");
        } else {
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}

export async function updateSection(sections) {

    const batch = sections.batch
    const section = sections.section
    const type = sections.type
    const room = sections.room
    const session = sections.session

    const query = `
    UPDATE sections
    SET
      type = $3,
      room = $4,
      session = $5,
    WHERE batch = $1 AND
    section = $2
  `
    const values = [batch, section, type, room, session]
    try {
        const client = await connect()
        const results = await client.query(query, values)

        if (results.rows.length <= 0) {
            throw new Error("successful");
        } else {
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}

export async function removeSection(batch,section) {


    const query = `
    DELETE FROM sections
    WHERE batch = $1 AND
    section = $2
  `
    const values = [batch, section]
    try {
        const client = await connect()
        const results = await client.query(query, values)

        if (results.rows.length <= 0) {
            throw new Error("successful");
        } else {
            return results.rows;
        }
    } catch (err) {
        console.error(err)
    }

}