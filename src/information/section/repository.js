import { connect } from "../../config/database.js";
import { HttpError } from "../../config/error-handle.js";

export async function getAll() {
  const query = "SELECT * FROM sections";

  const client = await connect();
  const results = await client.query(query);
  client.release();
  return results.rows;
}

export async function saveSection(sections) {
  const batch = sections.batch;
  const section = sections.section;
  const type = sections.type;
  const room = sections.room;
  const session = sections.session;
  const level_term = sections.level_term;

  const query =
    "INSERT INTO sections (batch, section,type,room,session) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [batch, section, type, room, session, level_term];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rows.length <= 0) {
    throw new HttpError(400, "Insert Failed");
  } else {
    return results.rows;
  }
}

export async function updateSection(sections) {
  const batch = sections.batch;
  const section = sections.section;
  const type = sections.type;
  const room = sections.room;
  const session = sections.session;
  const level_term = sections.level_term;

  const query = `
    UPDATE sections
    SET
      type = $3,
      room = $4,
      session = $5,
      level_term = $6
    WHERE batch = $1 AND
    section = $2
  `;
  const values = [batch, section, type, room, session];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rows.length <= 0) {
    throw new HttpError(400, "Update Failed");  
  } else {
    return results.rows;
  }
}

export async function removeSection(batch, section) {
  const query = `
    DELETE FROM sections
    WHERE batch = $1 AND
    section = $2
  `;
  const values = [batch, section];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rows.length <= 0) {
    throw new HttpError(400, "Delete Failed");  
  } else {
    return results.rows;
  }
}
