import { connect } from "../config/database.js";
import { HttpError } from "../config/error-handle.js";
import sma from "stablematch-common";

export async function getTemplate(key) {
  const query = "SELECT * FROM configs WHERE key=$1";
  const values = [key];
  const client = await connect();

  try {
    const results = await client.query(query, values);

    if (results.rows.length <= 0)
      throw new HttpError(404, "Template not found");

    return results.rows;
  } finally {
    client.release();
  }
}
export async function getAllTeacherMail() {
  const query = "SELECT initial, email FROM teachers";

  const client = await connect();
  try {
    const results = await client.query(query);

    if (results.rows.length <= 0) throw new HttpError(404, "Table is empty");

    return results.rows;
  } finally {
    client.release();
  }
}

export async function createForm(id, initial, type) {
  const query = "INSERT INTO forms (id, type, initial) VALUES ($1, $2, $3)";
  const values = [id, type, initial];

  const client = await connect();
  try {
    const results = await client.query(query, values);

    if (results.rowCount <= 0) throw new HttpError(400, "Insertion Failed");

    return results.rows;
  } finally {
    client.release();
  }
}

export async function getTheoryPreferencesStatus() {
  const query = `
    SELECT response, teachers.initial, teachers.name, teachers.email
    FROM forms
    INNER JOIN teachers ON forms.initial = teachers.initial
    WHERE type = 'theory-pref'
    `;

  const client = await connect();
  try {
    const results = await client.query(query);
    const cleanResult = results.rows.map((row) => {
      //console.log(row)
      return {
        response: row.response && JSON.parse(row.response),
        initial: row.initial,
        name: row.name,
        email: row.email,
      };
    });

    return cleanResult;
  } finally {
    client.release();
  }
}

export async function isFinalized() {
  const query = `SELECT COUNT(*) FROM teacher_assignment WHERE "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;
  const client = await connect();
  const results = await client.query(query);
  client.release();
  if (results.rows.length <= 0 || results.rows[0].count === "0") return false;
  else return true;
}

export async function finalize() {
  const client = await connect();
  try {
    await client.query("BEGIN");

    const teacherResponses = `
        select f.initial, f.response 
        from forms f 
        natural join teachers t 
        where f.type = 'theory-pref'
        order by t.seniority_rank ASC
        `;
    const teacherResponseResults = (await client.query(teacherResponses)).rows;

    const noOfTeachers = `select course_id, "type", COUNT(*) as no_of_teachers from courses_sections cs natural join courses course where "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION') group by course_id, "session", "type" `;
    const noOfTeachersResults = (await client.query(noOfTeachers)).rows
      .filter((row) => row.type === 0)
      .reduce((acc, row) => {
        acc[row.course_id] = parseInt(row.no_of_teachers);
        return acc;
      }, {});
    for (const row of teacherResponseResults) {
      const courses = JSON.parse(row.response);
      const initial = row.initial;
      for (const course_id of courses) {
        if (
          noOfTeachersResults[course_id] === undefined ||
          noOfTeachersResults[course_id] > 0
        ) {
          const query = `
                    INSERT INTO teacher_assignment (initial, course_id, session)
                    VALUES ($1, $2, (SELECT value FROM configs WHERE key='CURRENT_SESSION'))
                    `;
          const values = [initial, course_id];
          await client.query(query, values);
          if (noOfTeachersResults[course_id] !== undefined)
            noOfTeachersResults[course_id]--;
          break;
        }
      }
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return false;
  } finally {
    client.release();
  }
  return true;
}

export async function getTheoryAssignment() {
  const query = `select c.course_id, c."name", (select to_json(array_agg(row_to_json(t))) "teachers" from (select t.initial, t.name from teacher_assignment ta natural join teachers t where ta.course_id = c.course_id and ta.session = c."session") t ) from courses c where c.course_id like 'CSE%' and c.type = 0`;

  const client = await connect();
  const result = (await client.query(query)).rows;
  client.release();
  return result;
}

export async function getTeacherAssignmentDB() {
  const query = `SELECT course_id, initial FROM teacher_assignment WHERE "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;
  const client = await connect();
  const result = (await client.query(query)).rows;
  client.release();
  return result;
}

export async function getLabRoomAssignmentDB() {
  const query = `SELECT course_id, "session", batch, "section", room
  FROM lab_room_assignment;
  `;
  const client = await connect();
  const result = (await client.query(query)).rows;
  client.release();
  return result;
}

export async function setLabRoomAssignemntDB(assignment) {
  const insertQuery = `INSERT INTO lab_room_assignment (course_id, "session", batch, "section", room)
  VALUES ($1, (SELECT value FROM configs WHERE key='CURRENT_SESSION'), $2, $3, $4)`;

  const client = await connect();
  try {
    assignment.forEach((row) => {
      const values = [row.course_id, row.batch, row.section, row.room];
      client.query(insertQuery, values);
    });
  } finally {
    client.release();
  }
}

export async function getSessionalPreferencesStatus() {
  const query = `
    SELECT response, teachers.initial, teachers.name, teachers.email
    FROM forms
    INNER JOIN teachers ON forms.initial = teachers.initial
    WHERE type = 'sessional-pref'
    `;

  const client = await connect();
  try {
    const results = await client.query(query);
    const cleanResult = results.rows.map((row) => {
      //console.log(row)
      return {
        response: row.response && JSON.parse(row.response),
        initial: row.initial,
        name: row.name,
        email: row.email,
      };
    });

    return cleanResult;
  } finally {
    client.release();
  }
}

export async function isSessionalFinalized() {
  const query = `SELECT COUNT(*) FROM teacher_sessional_assignment WHERE "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;
  const client = await connect();
  const results = await client.query(query);
  client.release();
  if (results.rows.length <= 0 || results.rows[0].count === "0") return false;
  else return true;
}

export async function finalizeSessional() {
  const client = await connect();
  try {
    await client.query("BEGIN");

    const teacherResponses = `
        select f.initial, f.response 
        from forms f 
        natural join teachers t 
        where f.type = 'sessional-pref'
        order by t.seniority_rank ASC
        `;

    const allCourses = `select course_id, "section", batch,
    (select json_agg(ta.initial) from teacher_assignment ta where substr(ta.course_id,1, length(ta.course_id)-1) = substr(c.course_id,1, length(c.course_id)-1) and ta.session = c."session" ) "teachers"
    from courses_sections cs natural join courses c  where "type" = 1 and course_id like 'CSE%' and "session" = (SELECT value FROM configs WHERE key='CURRENT_SESSION')`;

    const teacherResponseResults = (await client.query(teacherResponses)).rows;
    const allCoursesResults = (await client.query(allCourses)).rows;
    const coursePerTheorySection = allCoursesResults.reduce((acc, row) => {
      if (!acc[row.course_id]) acc[row.course_id] = { sections: [] };
      acc[row.course_id].teachers = row.teachers || [];
      acc[row.course_id].batch = row.batch;
      acc[row.course_id].sections = [
        ...new Set([...acc[row.course_id].sections, row.section.substr(0, 1)]),
      ];
      return acc;
    }, {});

    const teachersSet = new Set();
    const teachers = [];
    const rankSubjects = [];

    const teacherPerCourse = [0, 1, 2];

    teacherResponseResults.forEach((row) => {
      const initial = row.initial;
      teachersSet.add(initial);
      teachers.push(initial);
      const courses = JSON.parse(row.response)
        .map((course_id) =>
          teacherPerCourse
            .map((no) =>
              coursePerTheorySection[course_id].sections
                .map((section) => `${course_id} ${section} ${no}`)
                .flat()
            )
            .flat()
        )
        .flat();
      rankSubjects.push(courses);
    });

    // console.log(rankSubjects);

    const courses = Object.keys(coursePerTheorySection);
    const rankTeachers = courses.map((subject) => {
      const courseTeachers = coursePerTheorySection[subject].teachers;
      const nonCourseTeachers = teachers.filter(
        (teacher) => !courseTeachers.includes(teacher)
      );
      return [...courseTeachers, ...nonCourseTeachers];
    });

    const stableMatchingCourses = courses
      .map((course_id) =>
        coursePerTheorySection[course_id].sections
          .map((section) =>
            teacherPerCourse.map((no) => `${course_id} ${section} ${no}`).flat()
          )
          .flat()
      )
      .flat();
    const stableMatchingRankOfCourses = (course) => {
      const course_id = course.split(" ")[0];
      const index = courses.indexOf(course_id);
      if (index === -1) throw new Error("Invalid course: " + course);
      return rankTeachers[index];
    };

    const stableMatchingTeachers = teachers;
    const stableMatchingRankOfTeachers = (teacher) => {
      const index = stableMatchingTeachers.indexOf(teacher);
      if (index === -1) throw new Error("Invalid teacher: " + teacher);
      return rankSubjects[index];
    };

    // console.log(stableMatchingCourses);
    // console.log(rankTeachers);
    // console.log(stableMatchingTeachers);
    // console.log(rankSubjects);

    const match = sma.match(
      stableMatchingTeachers,
      stableMatchingCourses,
      stableMatchingRankOfTeachers,
      stableMatchingRankOfCourses
    );

    const records = [];

    match.forEach((match) => {
      const [course_id, sectionTheory, rank] = match[1].split(" ");
      const initial = match[0];
      // coursePerTheorySection[course_id].sections.forEach((section) => {
      //   if (section.startsWith(sectionTheory))
      //     records.push({ initial, course_id, batch, section });
      // });
      allCoursesResults
        .filter((row) => row.course_id === course_id)
        .forEach((row) => {
          if (row.section.startsWith(sectionTheory))
            records.push({
              initial,
              course_id,
              batch: row.batch,
              section: row.section,
            });
        });
    });

    const insertQuery = `INSERT INTO teacher_sessional_assignment (initial, course_id, "session", batch, "section") VALUES ($1, $2, (SELECT value FROM configs WHERE key='CURRENT_SESSION'), $3, $4)`;

    records.forEach((row) => {
      const values = [row.initial, row.course_id, row.batch, row.section];
      client.query(insertQuery, values);
    });

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log(e);
    return false;
  } finally {
    client.release();
  }
  return true;
}

export async function getSessionalAssignment() {
  const query = `select c.course_id, c."name", (select to_json(array_agg(row_to_json(t))) "teachers" from (select t.initial, t.name, ta."section" from teacher_sessional_assignment ta natural join teachers t where ta.course_id = c.course_id and ta.session = c."session") t ) from courses c where c.course_id like 'CSE%' and c.type = 1`;

  const client = await connect();
  const result = (await client.query(query)).rows;
  client.release();
  return result;
}