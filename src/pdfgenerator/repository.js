import { connect } from "../config/database.js";

export async function routineForLvl(lvlTerm) {
    const query = `
    SELECT sa.course_id, sa.session, sa.batch, sa.section, sa.day, sa.time, ta.initial, s.type, s.room, s.level_term
    FROM schedule_assignment sa
    JOIN teacher_assignment ta ON sa.course_id = ta.course_id AND sa.session = ta.session
    JOIN sections s ON sa.section = s.section AND s.batch = sa.batch
    where s.level_term =$1;
    `

    const values = [lvlTerm];
    const client = await connect();
    const results = await client.query(query, values);
    client.release();
    return results.rows;
}

export async function routineForTeacher(initial) {

    const query = `
    SELECT sa.course_id, sa.session, sa.batch, sa.section, sa.day, sa.time, ta.initial, s.type, s.room, s.level_term
    FROM schedule_assignment sa
    JOIN teacher_assignment ta ON sa.course_id = ta.course_id AND sa.session = ta.session
    JOIN sections s ON sa.section = s.section AND s.batch = sa.batch
    where ta.initial =$1;
    `

    const values = [initial];
    const client = await connect();
    const results = await client.query(query, values);
    client.release();
    return results.rows;
}

export async function routineForRoom(room) {

    const query = `
    SELECT sa.course_id, sa.session, sa.batch, sa.section, sa.day, sa.time, ta.initial, s.type, s.room, s.level_term
    FROM schedule_assignment sa
    JOIN teacher_assignment ta ON sa.course_id = ta.course_id AND sa.session = ta.session 
    JOIN sections s ON sa.section = s.section AND s.batch = sa.batch
    where s.room =$1;
    `

    const values = [room];
    const client = await connect();
    const results = await client.query(query, values);
    client.release();
    return results.rows;
}