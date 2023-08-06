import { connect } from '../../config/database.js'



export async function getFormByUUID(uuid) {

    const query = 'SELECT * FROM forms WHERE id=$1'
    const values = [uuid]

    const client = await connect()
    const results = await client.query(query, values)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}

export async function getForms() {
    const query = 'SELECT * FROM forms'

    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }
}

export async function updateForm(uuid, response) {
    const query = `
    UPDATE forms
    SET
      response = $2
    WHERE id = $1
  `

    const values = [uuid, response]

    const client = await connect()
    const results = await client.query(query, values)
    console.log(results)

    if (results.rowCount <= 0) {
        throw new Error("Error");
    } else {
        client.release();
        return results.rowCount;
    }
}