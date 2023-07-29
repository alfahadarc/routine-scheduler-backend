import { connect } from '../config/database.js'

export function findAdmin(username) {
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
  
  