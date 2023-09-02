import { connect } from '../config/database.js'
import { HttpError } from '../config/error-handle.js';

export async function findAdminDB(username) {
  const query = 'SELECT * FROM admin WHERE username = $1';
  const values = [username]
  const client = await connect()
  const results = await client.query(query, values)
  client.release();

  if (results.rows.length <= 0) {
    throw new HttpError(404, "User not found");
  } else {
    return results.rows[0];
  }

}

export async function registerAdminDB(username, hash, email) {
  const query = 'INSERT INTO admin (username, password, email) VALUES ($1, $2, $3)';
  const values = [username, hash, email];

  const client = await connect()
  const results = await client.query(query, values)
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(400, "Insertion Failed");
  } else {
    return results.rows;
  }

}

export async function updateEmailDB(email, username) {
  const query = 'UPDATE admin SET email = $1 WHERE username = $2';
  const values = [email, username];

  const client = await connect()
  const results = await client.query(query, values)
  client.release();

  if (results.rowCount <= 0) {
    throw new HttpError(404, "User not found");
  } else {
    return results.rows;
  }
  
}

export async function adminExistsEmail(email) {
  const query = 'SELECT * FROM admin WHERE email = $1';
  const values = [email];
  const client = await connect();
  const result = await client.query(query, values);
  return result.rows.length > 0;
}
