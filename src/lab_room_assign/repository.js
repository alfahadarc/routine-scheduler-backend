import { connect } from '../../config/database.js'


export const getAllRoom = async () => {

    const query = 'SELECT * FROM rooms WHERE type = 1';
    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}

export const getAllCourse = async () => {

    const query = 'SELECT cs.course_id, cs.section, cs.batch , c.name, s.level_term \
                        FROM courses_sections cs\
                        JOIN courses c ON cs.course_id = c.course_id\
                        join sections s using (batch, section)\
                        WHERE cs.course_id LIKE \'CSE%\' and c.type=1';
    const client = await connect()
    const results = await client.query(query)

    if (results.rows.length <= 0) {
        throw new Error("Table is empty");
    } else {
        client.release();
        return results.rows;
    }

}

export const assignLabs = async (courseRooms) => {

    const client = await connect()

    for (const courseRoom of courseRooms) {
        console.log(courseRoom)
        const query = 'UPDATE lab_room_assignment SET room = $1 WHERE course_id = $2 AND section = $3'
        const values = [courseRoom.room, courseRoom.course_id, courseRoom.section]
        await client.query(query, values)
    }

    client.release();
}

