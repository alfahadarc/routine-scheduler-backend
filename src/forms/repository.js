import { connect } from '../../config/database.js'

async function getCourses(type){
    //theory-pref, theory-sched,sessional-pref

    const query = "SELECT value FROM configs WHERE key='CURRENT_SESSION'"
    const client = await connect()
    const results = await client.query(query)
    const current_session = results.rows[0].value
    client.release()

    if(type=="theory-pref"){
        const query = `SELECT course_id, name
        FROM courses
        where type =0 and session = $1
        `;
        const values =[current_session]
        const client = await connect()
        const results = await client.query(query,values)
        client.release()
        return results.rows

    }else if(type=="theory-sched"){

    }else if(type=="sessional-pref"){

    }
}

export async function getFormByUUID(uuid) {

    const query = `
    SELECT type, teachers.initial, teachers.name
    FROM forms
    INNER JOIN teachers ON forms.initial = teachers.initial
    WHERE id=$1
    `;
 
    const values = [uuid]

    const client = await connect()
    const results = await client.query(query, values)

    const courses =await getCourses(results.rows[0].type)
    console.log(results.rows)
    const data ={
        teachers: results.rows[0],
        courses:courses
    }

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return data;
    }

}

export async function getForms() {
    const query = 'SELECT * FROM forms'

    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }
}

export async function updateForm(uuid, response) {
    const query = `
    UPDATE forms
    SET
      response = $2
    WHERE id = $1
  `

    const values = [uuid, response]

    const client = await connect()
    const results = await client.query(query, values)
    console.log(results)

    if (results.rowCount <= 0) {
        throw new Error("Error");
    } else {
        client.release();
        return results.rowCount;
    }
}