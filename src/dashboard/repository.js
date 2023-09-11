import { connect } from "../config/database.js";

export async function getTheoryEmail() {
    const query = "SELECT value FROM configs WHERE key='THEORY_EMAIL'";
    const client = await connect();
    const results = await client.query(query);
    const email = results.rows[0].value;
    client.release();

    return email;
}

export async function getScheduleEmail() {
    const query = "SELECT value FROM configs WHERE key='SCHEDULE_EMAIL'";
    const client = await connect();
    const results = await client.query(query);
    const email = results.rows[0].value;
    client.release();


    return email;

}

export async function getSessionalEmail() {
    const query = "SELECT value FROM configs WHERE key='SESSIONAL_EMAIL'";
    const client = await connect();
    const results = await client.query(query);
    const email = results.rows[0].value;
    client.release();


    return email;

}

export async function updateTheoryEmail(email) {
    const query = "UPDATE configs SET value=$1 WHERE key='THEORY_EMAIL'";
    const client = await connect();
    const results = await client.query(query, [email]);
    client.release();

    return results.rowCount;
}

export async function updateScheduleEmail(email) {
    const query = "UPDATE configs SET value=$1 WHERE key='SCHEDULE_EMAIL'";
    const client = await connect();
    const results = await client.query(query, [email]);
    client.release();

    return results.rowCount;
}

export async function updateSessionalEmail(email) {
    const query = "UPDATE configs SET value=$1 WHERE key='SESSIONAL_EMAIL'";
    const client = await connect();
    const results = await client.query(query, [email]);
    client.release();

    return results.rowCount;
}

