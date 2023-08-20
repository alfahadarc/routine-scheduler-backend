import { connect } from "../../config/database.js";

export async function getSchedule(batch, section) {
    const query = `select course_id, "day" , "time"  from schedule_assignment sa where batch = $1 and "section" = $2 and "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`
    const values = [batch, section]
    const client = await connect()
    const results = await client.query(query, values)
    client.release()
    return results.rows
}