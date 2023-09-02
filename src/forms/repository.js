import { connect } from "../config/database.js";
import { HttpError } from "../config/error-handle.js";

async function getCourses(type) {
  //theory-pref, theory-sched,sessional-pref

  const query = "SELECT value FROM configs WHERE key='CURRENT_SESSION'";
  const client = await connect();
  const results = await client.query(query);
  const current_session = results.rows[0].value;
  client.release();

  if (type == "theory-pref") {
    const query = `SELECT course_id, name
        FROM courses
        where type =0 and session = $1
        `;
    const values = [current_session];
    const client = await connect();
    const results = await client.query(query, values);
    client.release();
    return results.rows;
  } else if (type == "theory-sched") {
  } else if (type == "sessional-pref") {
  }
}

export async function getTheoryPreferenceFormByUUID(uuid) {
  const query = `
    SELECT type, teachers.initial, teachers.name
    FROM forms
    INNER JOIN teachers ON forms.initial = teachers.initial
    WHERE id=$1 and type='theory-pref'
    `;

  const values = [uuid];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  let courses = await getCourses(results.rows[0].type);
  courses = courses.filter((course) => course.course_id.startsWith("CSE"));
  const data = {
    teacher: results.rows[0],
    courses: courses,
  };

  if (results.rows.length <= 0) {
    throw new HttpError(404, "Form not found");
  } else {
    return data;
  }
}

export async function getTheoryScheduleFormByUUID(uuid) {
  const query = `
    select id, initial, course_id, "session", class_per_week,
    (select to_json(array_agg(row_to_json(tbl))) from 
        (select t.initial, t.name from teacher_assignment ta2 natural join teachers t where ta2.course_id = ta.course_id order by t.seniority_rank) tbl
    ) teachers,
    (select to_json(array_agg(row_to_json(tbl))) from 
        (select batch, "section", s.level_term,
            (select to_json(array_agg(row_to_json(tbl))) from 
                (select sa."day", sa."time", sa.course_id from schedule_assignment sa where (sa.batch, sa."session", sa."section") = (cs.batch, cs."session", cs."section") ) tbl
            ) schedule 
        from courses_sections cs natural join sections s where cs.course_id = ta.course_id and cs."session" = ta."session" ) tbl
    ) sections
    from forms f natural join teacher_assignment ta join courses co using (course_id, "session")
    where f.id = $1 and f.type = 'theory-sched'
    `;
  const values = [uuid];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rows.length <= 0) {
    throw new Error("Table is empty");
  } else {
    return results.rows[0];
  }
}

export async function saveTheoryScheduleForm(uuid, response) {
  const query = `select ta.course_id, (select cs.batch from courses_sections cs where cs.course_id = ta.course_id and cs."session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION') limit 1) from forms f natural join teacher_assignment ta where f.id = $1`;
  const client = await connect();
  const results = await client.query(query, [uuid]);
  const course_id = results.rows[0].course_id;
  response.forEach((row) => {
    const query = `insert into schedule_assignment values ($1, (SELECT value FROM configs WHERE key='CURRENT_SESSION'), $2, $3, $4, $5) ON CONFLICT DO NOTHING`;
    const values = [course_id, row.batch, row.section, row.day, row.time];
    client.query(query, values);
  });
  client.release();
  return results.rows[0].batch;
}

export async function getForms() {
  const query = "SELECT * FROM forms";

  const client = await connect();
  const results = await client.query(query);

  if (results.rows.length <= 0) {
    throw new Error("Table is empty");
  } else {
    client.release();
    return results.rows;
  }
}

export async function updateForm(uuid, response, type = "theory-pref") {
  const client = await connect();

  const query = `
    UPDATE forms
    SET
      response = $2
    WHERE id = $1 AND type = $3 AND response IS NULL
  `;
  let values = [uuid, response, type];

  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Insertion Failed");
  } else {
    return results.rowCount;
  }
}
