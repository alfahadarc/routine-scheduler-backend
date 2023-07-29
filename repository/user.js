import { connect } from '../config/database.js'


connect().then(
    (client) => {
        client.query('SELECT * FROM admin').then(
            (result) => {
                console.log(result.rows)
            }
        ).catch(console.error)
    }
  ).catch(console.error)
  