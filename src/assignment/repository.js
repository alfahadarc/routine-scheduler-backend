import { connect } from "../../config/database.js";

export async function getTemplate(key) {
  const query = "SELECT * FROM configs WHERE key=$1";
  const values = [key];
  const client = await connect();
  const results = await client.query(query, values);

  if (results.rows.length <= 0) {
    throw new Error("Table is empty");
  } else {
    client.release();
    return results.rows;
  }
}
export async function getAllTeacherMail() {
  const query = "SELECT initial, email FROM teachers";

  const client = await connect();
  const results = await client.query(query);

  if (results.rows.length <= 0) {
    throw new Error("Table is empty");
  } else {
    client.release();
    return results.rows;
  }
}

export async function createForm(id, initial, type) {
  const query = "INSERT INTO forms (id, type, initial) VALUES ($1, $2, $3)";
  const values = [id, type, initial];

  const client = await connect();
  const results = await client.query(query, values);

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
    WHERE type = 'theory-pref'
    `;

  const client = await connect();
  const results = await client.query(query);
  client.release();
  const cleanResult = results.rows.map((row) => {
    //console.log(row)
    return {
      response: row.response && JSON.parse(row.response),
      initial: row.initial,
      name: row.name,
      email: row.email,
    };
  });

  return cleanResult;
}

export async function isFinalized() {
  const query = `SELECT COUNT(*) FROM teacher_assignment WHERE "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;
  const client = await connect();
  const results = await client.query(query);
  client.release();

  if (results.rows.length <= 0 || results.rows[0].value === 0) return false;
  else return true;
}

export async function finalize() {
  const client = await connect();
  try {
    await client.query("BEGIN");

    const teacherResponses = `
        select f.initial, f.response 
        from forms f 
        natural join teachers t 
        where f.type = 'theory-pref'
        order by t.seniority_rank ASC
        `;
    const teacherResponseResults = (await client.query(teacherResponses)).rows;

    const noOfTeachers = `select course_id, "type", COUNT(*) as no_of_teachers from courses_sections cs natural join courses course where "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION') group by course_id, "session", "type" `;
    const noOfTeachersResults = (await client.query(noOfTeachers)).rows
      .filter((row) => row.type === 0)
      .reduce((acc, row) => {
        acc[row.course_id] = row.no_of_teachers;
        return acc;
      }, {});

    for (const row of teacherResponseResults) {
      const courses = JSON.parse(row.response);
      const initial = row.initial;
      for (const course_id of courses) {
        if (
          !noOfTeachersResults[course_id] ||
          noOfTeachersResults[course_id] > 0
        ) {
          const query = `
                    INSERT INTO teacher_assignment (initial, course_id, session)
                    VALUES ($1, $2, (SELECT value FROM configs WHERE key='CURRENT_SESSION'))
                    `;
          const values = [initial, course_id];
          await client.query(query, values);
          if (noOfTeachersResults[course_id]) noOfTeachersResults[course_id]--;
          break;
        }
      }
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return false;
  } finally {
    client.release();
  }
  return true;
}

export async function getTheoryAssignment() {
  const query = `select c.course_id, c."name", (select to_json(array_agg(row_to_json(t))) "teachers" from (select t.initial, t.name from teacher_assignment ta natural join teachers t where ta.course_id = c.course_id and ta.session = c."session") t ) from courses c where c.course_id like 'CSE%'`

  const client = await connect();
  const result = (await client.query(query)).rows;
  client.release();
  return result;
}
