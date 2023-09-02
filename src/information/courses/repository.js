import { connect } from "../../config/database.js";



export async function getAll() {

    try {
        const query = `SELECT * FROM courses WHERE course_id != 'CT'`;
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
                matchingCourse.batch = sectionInfo.batch
            }
        }
        if (course_list.length <= 0) {
            next(new Error("Table is empty"));
        } else {
            client.release()
            return course_list;
        }
    } catch (err) {
        next(err)
    }

}


export async function saveCourse(Course) {

    const course_id = Course.course_id
    const name = Course.name
    const type = Course.type
    const session = Course.session
    const class_per_week = Course.class_per_week
    const batch = Course.batch
    const sections = Course.sections

    var query = 'INSERT INTO courses (course_id, name, type, session, class_per_week) VALUES ($1, $2, $3, $4, $5 )';
    var values = [course_id, name, type, session, class_per_week];

    var client = await connect()
    var results = await client.query(query, values)

    if (batch !== "") {
      for (let section of sections) {
        query =
          "INSERT INTO courses_sections (course_id, session, batch, section) VALUES ($1, $2, $3, $4 )";
        values = [course_id, session, batch, section];
        results = await client.query(query, values);
        if (results.rowCount <= 0) {
            next(new Error("Insertion Failed"))
        }
      }
    }


    if (results.rowCount <= 0) {
        next(new Error("Insertion Failed"))
    } else {
        client.release();
        return results.rowCount;
    }
}



export async function updateCourse(Course) {

    const course_id_old = Course.course_id_old
    const course_id = Course.course_id
    const name = Course.name
    const type = Course.type
    const session = Course.session
    const class_per_week = Course.class_per_week
    const batch = Course.batch
    const sections = Course.sections

    var query = `
  DELETE FROM courses_sections
  WHERE course_id = $1 AND session=$2;
    `;
    var values = [course_id_old, session];

    var client = await connect()
    var results = await client.query(query, values)

    query = `UPDATE courses SET 
    course_id=$1,
    name=$2, 
    type=$3, 
    session=$4, 
    class_per_week=$5
    WHERE
    course_id=$6
     `;
    values = [course_id, name, type, session, class_per_week, course_id_old];

    client = await connect()
    results = await client.query(query, values)

    for (let section of sections) {
        query = 'INSERT INTO courses_sections (course_id, session, batch, section) VALUES ($1, $2, $3, $4 )';
        values = [course_id, session, batch, section];
        results = await client.query(query, values)
        if (results.rowCount <= 0) {
            next(new Error("Insertion Failed"))
        }
    }

    if (results.rowCount <= 0) {
        next(new Error("Update Failed"));
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
        next(new Error("Delation Failed"))
    } else {
        client.release();
        return results.rowCount; // Return the first found admin
    }
}

export async function getAllLab() {

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