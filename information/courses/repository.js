import { connect } from '../../config/database.js'



export async function getAll() {

    try {
        const query = 'SELECT * FROM courses';
        const client = await connect()
        const courses = await client.query(query)

        const query2 = 'SELECT * FROM courses_sections';

        const courses_section = await client.query(query2)

        const course_list = courses.rows
        const courses_section_list = courses_section.rows


        for (const sectionInfo of courses_section_list) {
            const matchingCourse = course_list.find(course =>
                course.course_id === sectionInfo.course_id &&
                course.session === sectionInfo.session
            );

            if (matchingCourse) {
                if (!matchingCourse.sections) {
                    matchingCourse.sections = [];
                }
                matchingCourse.sections.push(sectionInfo.section);
            }
        }
        if (course_list.length <= 0) {
            throw new Error("Table is empty");
        } else {
            return course_list;
        }
    } catch {
        console.error()
    }

}


export async function saveCourse(Course) {

    const course_id = Course.course_id
    const name = Course.name
    const type = Course.type
    const session = Course.session
    const class_per_week = Course.class_per_week

    const query = 'INSERT INTO courses (course_id, name, type, session, class_per_week) VALUES ($1, $2, $3, $4, $5 )';
    const values = [course_id, name, type, session, class_per_week];

    const client = await connect()
    const results = await client.query(query, values)

    if (results.rowCount <= 0) {
        throw new Error("Insertion Failed");
    } else {
        client.release();
        return results.rowCount; // Return the first found admin
    }
}



export async function updateCourse(Course) {

    const course_id = Course.course_id
    const name = Course.name
    const type = Course.type
    const session = Course.session
    const class_per_week = Course.class_per_week

    const query = `
  UPDATE courses
  SET
    name = $2,
    type = $3,
    session = $4,
    class_per_week = $5
  WHERE course_id = $1;
    `;
    const values = [course_id, name, type, session, class_per_week];

    const client = await connect()
    const results = await client.query(query, values)

    if (results.rowCount <= 0) {
        throw new Error("Error updating data in the database: " + error.message);
    } else {
        client.release();
        return results.rowCount; // Return the first found admin
    }
}

export async function removeCourse(course_id) {
  const query = `
      DELETE FROM courses
      WHERE course_id = $1
    `;
  const values = [course_id];
  const client = await connect()
  const results = await client.query(query, values)

  if (results.rowCount <= 0) {
    throw new Error("Error deleting data in the database: " + error.message);
  } else {
    client.release();
    return results.rowCount; // Return the first found admin
  }
}