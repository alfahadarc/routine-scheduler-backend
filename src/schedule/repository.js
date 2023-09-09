import { connect } from "../config/database.js";

export async function getTheorySchedule(batch, section) {
  const query = `select course_id, "day" , "time"  from schedule_assignment sa natural join courses c where batch = $1 and "section" = $2 and type = 0 and "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;
  const values = [batch, section];
  const client = await connect();
  const results = await client.query(query, values);
  client.release();
  return results.rows;
}

export async function setTheorySchedule(batch, section, course, schedule) {
  const query = `INSERT INTO schedule_assignment (batch, "section", "session", course_id, "day", "time") VALUES ($1, $2, (SELECT value FROM configs WHERE key='CURRENT_SESSION'), $3, $4, $5)`;
  const removeCourses = `DELETE FROM schedule_assignment WHERE batch = $1 and "section" = $2 and course_id = $3 AND "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;

  const client = await connect();
  try {
    await client.query("BEGIN");
    await client.query(removeCourses, [batch, section, course]);
    for (const slot of schedule) {
      const values = [batch, section, course, slot.day, slot.time];
      await client.query(query, values);
    }
    await client.query("COMMIT");
    return true
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    return false
  } finally {
    client.release();
  }
}

export async function getSessionalSchedule(batch, section) {
  const query = `select course_id, "day" , "time"  from schedule_assignment sa natural join courses c where batch = $1 and "section" = $2 and type = 1 and "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;
  const values = [batch, section];
  const client = await connect();
  const results = await client.query(query, values);
  client.release();
  return results.rows;
}

export async function setSessionalSchedule(batch, section, schedule) {
  const query = `INSERT INTO schedule_assignment (batch, "section", "session", course_id, "day", "time") VALUES ($1, $2, (SELECT value FROM configs WHERE key='CURRENT_SESSION'), $3, $4, $5)`;
  const removeCourses = `DELETE FROM schedule_assignment WHERE batch = $1 and "section" = $2 AND "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;

  const client = await connect();
  try {
    await client.query("BEGIN");
    await client.query(removeCourses, [batch, section]);
    for (const slot of schedule) {
      const values = [batch, section, slot.course_id, slot.day, slot.time];
      await client.query(query, values);
    }
    await client.query("COMMIT");
    return true
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    return false
  } finally {
    client.release();
  }
}

export async function getTheoryScheduleForms() {
  const query = `
    SELECT response, teachers.initial, teachers.name, teachers.email
    FROM forms
    INNER JOIN teachers ON forms.initial = teachers.initial
    WHERE type = 'theory-sched'
    `;

    const client = await connect();
    const results = (await client.query(query)).rows;
    client.release();
    return results;
}

export async function getTheoryScheduleTeachers() {
  const query = `
  select DISTINCT initial, cs.batch  from teacher_assignment ta join courses_sections cs using (course_id, "session")
  `
  const client = await connect();
  const results = (await client.query(query)).rows;
  client.release();
  return results;
}

export async function nextInSeniority() {
  const query = `
  select distinct on (batch) id, course_id, batch, t.initial, t."name", t.email, t.surname from forms f join teacher_assignment ta using (initial) 
  join courses_sections cs using (course_id) natural join teachers t 
  where f."type" = 'theory-sched' and response is null order by batch, seniority_rank`
  const client = await connect();
  const results = (await client.query(query)).rows;
  client.release();
  return results;
}

export async function getAllScheduleDB() {
  const query = `
  select * from schedule_assignment sa
  `
  const client = await connect();
  const results = (await client.query(query)).rows;
  client.release();
  return results;
}