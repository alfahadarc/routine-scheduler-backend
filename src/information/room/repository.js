import { connect } from "../../config/database.js";
import { HttpError } from "../../config/error-handle.js";

export async function getAll() {
  const query = "SELECT * FROM rooms";

  const client = await connect();
  const results = await client.query(query);
  client.release();

  return results.rows;
}

export async function saveRoom(rooms) {
  const room = rooms.room;
  const type = rooms.type;

  const query = "INSERT INTO rooms (room, type) VALUES ($1, $2)";
  const values = [room, type];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Insert Failed");
  } else {
    return results.rows;
  }
}

export async function updateRoom(rooms) {
  const type = rooms.type;
  const room = rooms.room;

  const query = `
    UPDATE rooms
  SET
    type = $2
  WHERE room = $1
  `;
  const values = [room, type];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Update Failed");
  } else {
    return results.rows;
  }
}

export async function removeRoom(room) {
  const query = `
    DELETE FROM rooms
    WHERE room = $1
  `;
  const values = [room];

  const client = await connect();
  const results = await client.query(query, values);
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Delete Failed");
  } else {
    return results.rows;
  }
}

export async function getLabs() {
  const query = "SELECT * FROM rooms WHERE type = 1";

  const client = await connect();
  const results = await client.query(query);
  client.release();

  return results.rows;
}
