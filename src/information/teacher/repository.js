import { connect } from "../../config/database.js";
import { HttpError } from "../../config/error-handle.js";

export async function getAll() {
  const query = "SELECT * FROM teachers";
  const client = await connect();
  const results = await client.query(query);
  client.release();
  return results.rows;
}

export async function findByInitial(initial) {
  const query = "SELECT * FROM teachers WHERE initial=$1";
  const values = [initial];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();
  if (results.rows.length <= 0) {
    throw new HttpError(404, "Not Found");
  } else {
    return results.rows;
  }
}

export async function saveTeacher(teacher) {
  const initial = teacher.initial;
  const name = teacher.name;
  const surname = teacher.surname;
  const email = teacher.email;
  const seniority_rank = teacher.seniority_rank;
  const active = teacher.active;
  const theory_courses = teacher.theory_courses;
  const sessional_courses = teacher.sessional_courses;

  const query =
    "INSERT INTO teachers (initial, name,surname,email,seniority_rank,active,theory_courses,sessional_courses) VALUES ($1, $2, $3,$4,$5,$6,$7,$8 )";
  const values = [
    initial,
    name,
    surname,
    email,
    seniority_rank,
    active,
    theory_courses,
    sessional_courses,
  ];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Insert Failed");
  } else {
    return results.rowCount; // Return the first found admin
  }
}

export async function updateTeacher(teacher) {
  const initial = teacher.initial;
  const name = teacher.name;
  const surname = teacher.surname;
  const email = teacher.email;
  const seniority_rank = teacher.seniority_rank;
  const active = teacher.active;
  const theory_courses = teacher.theory_courses;
  const sessional_courses = teacher.sessional_courses;

  const query = `
      UPDATE teachers
      SET
        name = $2,
        surname = $3,
        email = $4,
        seniority_rank = $5,
        active = $6,
        theory_courses = $7,
        sessional_courses = $8
      WHERE initial = $1
    `;
  const values = [
    initial,
    name,
    surname,
    email,
    seniority_rank,
    active,
    theory_courses,
    sessional_courses,
  ];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Update Failed");
  } else {
    return results.rowCount; // Return the first found admin
  }
}

export async function removeTeacher(initial) {
  const query = `
      DELETE FROM teachers
      WHERE initial = $1
    `;
  const values = [initial];
  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(404, "Delete Failed");
  } else {
    return results.rowCount; // Return the first found admin
  }
}
