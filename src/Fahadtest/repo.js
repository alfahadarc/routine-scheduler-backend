import { connect } from "../config/database.js";




export async function store(initial, list) {
    const query = `
  INSERT INTO fahadtest (initial, lists) VALUES ($1, $2)
  `;
    const values = [initial, list];

    const client = await connect();
    const results = await client.query(query, values);

    client.release();
    return results;
}



export async function getLabroom(initial, list) {
  const query = `
SELECT * from lab_room_assignment 
`;

  const client = await connect();
  const results = await client.query(query);

  client.release();
  return results.rows;
}