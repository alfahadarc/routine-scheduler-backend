import { async } from "@firebase/util";
import { connect } from "../config/database.js";

export async function routineForLvl(lvlTerm) {
    const query = `
    select 
    ass.*,
    level_term,
    c.type,
    coalesce(room, (select lra.room from lab_room_assignment lra where ass.course_id = lra.course_id and ass.session = lra.session and ass.batch = lra.batch and ass.section = lra.section)) room
    from
    ( select ta.initial, sa.* from teacher_assignment ta join courses_sections cs using (course_id, "session") right outer join schedule_assignment sa using (course_id, "session", batch, "section") where session = (SELECT value FROM configs WHERE key='CURRENT_SESSION')
    union
    select ta.initial, sa.* from teacher_sessional_assignment ta right outer join schedule_assignment sa using (course_id, "session", batch, "section") where session = (SELECT value FROM configs WHERE key='CURRENT_SESSION') ) ass
    natural join sections s
    natural join courses c 
    where level_term = $1
  
  ;
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

export async function getInitials(){
    const query = `
        SELECT initial
        FROM teachers;
        `
        const client = await connect();
        const results = await client.query(query);
        client.release();
        return results.rows
}

export async function getRooms(){
    const query = `
        SELECT room
        FROM rooms;
        `
        const client = await connect();
        const results = await client.query(query);
        client.release();
        return results.rows
}

export async function getRoutine(type, key) {
    const query = `
    select url
    from routine_pdf
    where type = $1 and key = $2
    `
    const values = [type, key];
    const client = await connect();
    const results = await client.query(query, values);
    client.release();
    return results.rows[0];
}

export async function saveRoutine(type, key, url) {
    const insertQuery = `
    insert into routine_pdf (type, key, url)
    values ($1, $2, $3)
    `
    const values = [type, key, url];
    const client = await connect();
    const results = await client.query(insertQuery, values);
    client.release();
    return results.rowCount > 0;
}