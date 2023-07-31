import { connect } from '../config/database.js'

export function findAdminDB(username) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM admin WHERE username = $1';

    connect()
      .then((client) => {
        client.query(query, [username], (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.rows.length <= 0) {
              reject(new Error("No user found"));
            } else {
              resolve(results.rows[0]); // Return the first found admin
            }
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function registerAdminDB(username, hash, email) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO admin (username, password, email) VALUES ($1, $2, $3)';
    const values = [username, hash, email];
    connect()
      .then((client) => {
        client.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.rowCount != 1) {
              reject(new Error("Insert failed!"));
            } else {
              resolve(results.rowCount); 
            }
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateEmailDB(email, username){
  return new Promise((resolve, reject) => {
    const query = 'UPDATE admin SET email = $1 WHERE username = $2';
    const values = [email, username];
    connect()
      .then((client) => {
        client.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.rowCount != 1) {
              reject(new Error("Update failed!"));
            } else {
              resolve(results.rowCount); 
            }
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

