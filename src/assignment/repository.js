import { connect } from '../../config/database.js'


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

export async function createForm(id, initial, type) {
    const query = 'INSERT INTO forms (id, type, initial) VALUES ($1, $2, $3)'
    const values = [id, type, initial]

    const client = await connect()
    const results = await client.query(query, values)

    if (results.rowAffected <= 0) {
        throw new Error("Insertion Failed");
    } else {
        client.release();
        return results.rowAffected;
    }

}

export async function getTheoryPreferencesStatus() {
    const query = `
    SELECT response, teachers.initial, teachers.name, teachers.email
    FROM forms
    INNER JOIN teachers ON forms.initial = teachers.initial
    `;

    const client = await connect()
    const results = await client.query(query)
    client.release()

    return results.rows
}

export async function finalize() {
    const query = `
    UPDATE public.configs
    SET value = 1
    WHERE "key" = 'THEORY_PREFERENCES_COMPLETE'
    `;

    const client = await connect()
    const results = await client.query(query)


    client.release()
    return results.rowCount
}