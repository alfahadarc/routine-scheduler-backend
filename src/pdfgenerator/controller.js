import pdf from "pdf-creator-node";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import admin from "firebase-admin";
import { serviceAccount } from "../../pvtkey.js";
import {
  routineForLvl,
  routineForTeacher,
  routineForRoom,
  getInitials,
  getRooms,
  getLevelTerms,
} from "./repository.js";
import { async } from "@firebase/util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dayOrder = {
  Saturday: 0,
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
};

var options = {
  format: "A3",
  orientation: "landscape",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">Author: AA Fahad</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      first: "Cover page",
      2: "Second page", // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: "Last Page",
    },
  },
};

function sortedData(datas) {
  //sort by day
  var sortedDatas = [];
  var keys = Object.keys(datas);
  var len = keys.length;

  keys.sort(function (a, b) {
    return dayOrder[a] - dayOrder[b];
  });

  for (var i = 0; i < len; i++) {
    var k = keys[i];
    sortedDatas[k] = datas[k];
  }
  return sortedDatas;
}

function generateDataAsSorted(MergedAppointmentsA) {
  ///modifying for time
  // Function to create a new array with 5 appointments for each day
  function generateAppointments(day) {
    const appointments = [];
    for (let time = 8; time <= 12; time++) {
      const existingAppointment = day.appointments.find(
        (app) => app.time === time
      );
      if (existingAppointment) {
        appointments.push(existingAppointment);
      } else {
        appointments.push({
          time: time,
          initial: null,
          course_id: null,
          section: null,
          level_term: null,
          room: null,
        });
      }
    }
    return appointments;
  }

  // Modify the data
  const modifiedData = MergedAppointmentsA.map((day) => {
    return {
      day: day.day,
      appointments: generateAppointments(day),
    };
  });

  // Sort the data based on time
  modifiedData.forEach((day) => {
    day.appointments.sort((a, b) => a.time - b.time);
  });

  return modifiedData;
}

function mergedAppointments(sectionAAppointments) {
  //merge teacher
  const mergedAppointments = [];

  sectionAAppointments.forEach((day) => {
    day.appointments.forEach((appointment) => {
      // Find if there's an existing appointment with same attributes (except 'initial')
      const existingAppointmentIndex = mergedAppointments.findIndex(
        (existing) =>
          existing.day === day.day &&
          existing.appointments[0].time === appointment.time &&
          existing.appointments[0].room === appointment.room &&
          existing.appointments[0].course_id === appointment.course_id &&
          existing.appointments[0].section === appointment.section
      );

      if (existingAppointmentIndex !== -1) {
        // Merge 'initial' values
        mergedAppointments[
          existingAppointmentIndex
        ].appointments[0].initial += `/${appointment.initial}`;
      } else {
        // Create a new appointment
        mergedAppointments.push({
          day: day.day,
          appointments: [
            {
              time: appointment.time,
              initial: appointment.initial,
              room: appointment.room,
              course_id: appointment.course_id,
              section: appointment.section,
            },
          ],
        });
      }
    });
  });

  const MergedAppointmentsA = mergedAppointments.reduce((acc, curr) => {
    const existingDay = acc.find((item) => item.day === curr.day);
    if (existingDay) {
      existingDay.appointments.push(...curr.appointments);
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const modifiedData = generateDataAsSorted(MergedAppointmentsA);

  // return MergedAppointmentsA;
  return modifiedData;
}

async function generateData(rows) {
  const data = rows.reduce((acc, curr) => {
    const { day, time, initial, room, course_id, section, type } = curr;
    const onlySec = section.substr(0, 1);
    if (!acc[onlySec])
      acc[onlySec] = {
        Saturday: {},
        Sunday: {},
        Monday: {},
        Tuesday: {},
        Wednesday: {},
      };
    if (!acc[onlySec][day][time]) acc[onlySec][day][time] = {};
    if (initial !== acc[onlySec][day][time].initial && initial)
      acc[onlySec][day][time].initial = acc[onlySec][day][time].initial
        ? acc[onlySec][day][time].initial + "/" + initial
        : initial;
    if (room !== acc[onlySec][day][time].room && room)
      acc[onlySec][day][time].room = acc[onlySec][day][time].room
        ? acc[onlySec][day][time].room + "/" + room
        : room;
    if (course_id !== acc[onlySec][day][time].course_id && course_id)
      acc[onlySec][day][time].course_id = acc[onlySec][day][time].course_id
        ? acc[onlySec][day][time].course_id + "/" + course_id
        : course_id;
    if (section !== acc[onlySec][day][time].section && section)
      acc[onlySec][day][time].section = acc[onlySec][day][time].section
        ? acc[onlySec][day][time].section + "/" + section
        : section;
    acc[onlySec][day][time].colspan = type === 0 ? 1 : 3;
    // acc[onlySec][day].sort((a, b) => (a.time+4)%12 - (b.time+4)%12);
    return acc;
  }, {});

  const appointments = {};
  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
  const time = [8, 9, 10, 11, 12, 1, 2, 3, 4];
  for (const section in data) {
    if (!appointments[section]) appointments[section] = [];
    for (let j = 0; j < days.length; j++) {
      const day = days[j];
      appointments[section][j] = [];
      for (let i = 0; i < time.length; ) {
        const t = time[i];
        if (data[section][day][t]) {
          appointments[section][j].push(data[section][day][t]);
          i += data[section][day][t].colspan;
          console.log(data[section][day][t]);
        } else {
          appointments[section][j].push({
            colspan: 1,
            initial: "",
            room: "",
            course_id: "",
            section: "",
          });
          i++;
        }
      }
      appointments[section][j] = {
        day: day,
        appointments: appointments[section][j],
      };
    }
  }

  return appointments;
}
async function createPDFStd(datas, filename) {
  //fetch template
  var html = fs.readFileSync(
    path.resolve(__dirname, "templateStudent.html"),
    "utf8"
  );
  //create output directory
  var outputDir = path.resolve(__dirname, filename + ".pdf");

  var document = {
    html: html,
    data: {
      datas: datas,
    },
    path: outputDir,
    type: "",
  };
  return (await pdf.create(document, options)).filename;
}

export async function generatePDF(req, res, next) {
  const lvlTerm = req.params.lvlTerm;

  try {
    const rows = await routineForLvl(lvlTerm);
    if (rows.length === 0) {
      res.status(404).json({ message: "No data found" });
    } else {
      const appointments = await generateData(rows);
      const sections = Object.keys(appointments).sort();

      const pdfData = [];
      for (const section of sections) {
        const appointment = appointments[section];
        pdfData.push({ title: `${lvlTerm} ${section}`, schedule: appointment });
      }
      const filename = await createPDFStd(pdfData, lvlTerm);

      console.log(filename);

      res.status(200).json({ message: "PDF generated" });
    }
  } catch (err) {
    next(err);
  }
}

//////Teacher PDF
async function generateDataTeacher(rows) {
  var datas = [];
  rows.forEach((obj) => {
    const { day, time, room, course_id, section, level_term } = obj;

    if (!datas[day]) {
      datas[day] = [];
    }

    datas[day].push({ time, room, course_id, section, level_term });
  });

  var sortedDatas = sortedData(datas);

  const teacherAppointments = [];

  for (const day in sortedDatas) {
    const appointments = datas[day];
    const value = [];

    for (const appointment of appointments) {
      value.push(appointment);
    }

    if (value.length > 0) {
      teacherAppointments.push({ day, appointments: value });
    }
  }

  return teacherAppointments;
}

function mergedForTeacher(sectionAAppointments) {
  //merge teacher
  const mergedAppointments = [];

  sectionAAppointments.forEach((day) => {
    day.appointments.forEach((appointment) => {
      // Find if there's an existing appointment with same attributes (except 'initial')
      const existingAppointmentIndex = mergedAppointments.findIndex(
        (existing) =>
          existing.day === day.day &&
          existing.appointments[0].time === appointment.time &&
          existing.appointments[0].course_id === appointment.course_id &&
          existing.appointments[0].level_term === appointment.level_term
      );

      if (existingAppointmentIndex !== -1) {
        // Merge 'initial' values
        mergedAppointments[
          existingAppointmentIndex
        ].appointments[0].room += `/${appointment.room}`;
        mergedAppointments[
          existingAppointmentIndex
        ].appointments[0].section += `/${appointment.section}`;
      } else {
        // Create a new appointment
        mergedAppointments.push({
          day: day.day,
          appointments: [
            {
              time: appointment.time,
              room: appointment.room,
              course_id: appointment.course_id,
              section: appointment.section,
              level_term: appointment.level_term,
            },
          ],
        });
      }
    });
  });

  const MergedAppointmentsA = mergedAppointments.reduce((acc, curr) => {
    const existingDay = acc.find((item) => item.day === curr.day);
    if (existingDay) {
      existingDay.appointments.push(...curr.appointments);
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const modifiedData = generateDataAsSorted(MergedAppointmentsA);

  // return MergedAppointmentsA;
  return modifiedData;
}

async function createPDFTeacher(datas, initial) {
  var html = fs.readFileSync(
    path.resolve(__dirname, "templateTeacher.html"),
    "utf8"
  );
  //create output directory
  var outputDir = path.resolve(__dirname, "routine_" + initial + ".pdf");

  var document = {
    html: html,
    data: {
      initial: initial,
      days: datas,
    },
    path: outputDir,
    type: "",
  };
  pdf
    .create(document, options)
    .then((stat) => {
      console.log(stat);
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function teacherPDF(req, res, next) {
  const initial = req.params.initial;

  try {
    const rows = await routineForTeacher(initial);
    if (rows.length === 0) {
      res.status(404).json({ message: "No data found" });
    } else {
      const data = await generateDataTeacher(rows);
      const mergedData = mergedForTeacher(data);
      await createPDFTeacher(mergedData, initial);

      res.status(200).json({ message: mergedData });
    }
  } catch (err) {
    next(err);
  }
}

//////Room PDF
async function generateDataRoom(rows) {
  var datas = [];
  rows.forEach((obj) => {
    const { day, time, initial, course_id, section, level_term } = obj;

    if (!datas[day]) {
      datas[day] = [];
    }

    datas[day].push({ time, initial, course_id, section, level_term });
  });

  var sortedDatas = sortedData(datas);

  const roomAppointments = [];

  for (const day in sortedDatas) {
    const appointments = datas[day];
    const value = [];

    for (const appointment of appointments) {
      value.push(appointment);
    }

    if (value.length > 0) {
      roomAppointments.push({ day, appointments: value });
    }
  }

  return roomAppointments;
}
async function createPDFRoom(datas, room) {
  var html = fs.readFileSync(
    path.resolve(__dirname, "templateRoom.html"),
    "utf8"
  );
  //create output directory
  var outputDir = path.resolve(__dirname, "routine_" + room + ".pdf");

  var document = {
    html: html,
    data: {
      room: room,
      days: datas,
    },
    path: outputDir,
    type: "",
  };
  pdf
    .create(document, options)
    .then((stat) => {
      console.log(stat);
    })
    .catch((error) => {
      console.error(error);
    });
}
export async function roomPDF(req, res, next) {
  const room = req.params.room;

  try {
    const rows = await routineForRoom(room);

    if (rows.length === 0) {
      res.status(404).json({ message: "No data found" });
    } else {
      const data = await generateDataRoom(rows);
      const mergedData = mergedAppointments(data);
      await createPDFRoom(mergedData, room);
      res.status(200).json({ message: mergedData });
    }
  } catch (err) {
    next(err);
  }
}

//initialize the app
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
  storageBucket: "gs://routineschedule-cd03a.appspot.com", //you can find in storage.
});

//get bucket
var bucket = admin.storage().bucket();

//function to upload file
async function uploadFile(filepath, filename) {
  await bucket.upload(filepath, {
    gzip: true,
    destination: filename,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  console.log(`${filename} uploaded to bucket.`);
}

//function to get url

async function generateSignedUrl(filename) {
  const options = {
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60,
  };

  const [url] = await bucket.file(filename).getSignedUrl(options);
  // console.log(url);
  return url;
}

// var filepath = outputDir;
var filename = "test.pdf"; //can be anything, it will be the name with which it will be uploded to the firebase storage.

export async function uploadPDF(req, res) {
  // uploadFile(filepath, filename)
  const url = await generateSignedUrl(filename);
  res.status(200).json({ url: url });
}

async function uploadRoutine(filepath, filename) {
  await bucket.upload(filepath, {
    gzip: true,
    destination: filename,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
}

export async function serveLvlTermPDF(req, res, next) {
  const lvlTerm = req.params.lvlTerm;
  var outputDir = path.resolve(__dirname, lvlTerm + ".pdf");

  if (!fs.existsSync(outputDir)) {
    try {
      const rows = await routineForLvl(lvlTerm);
      if (rows.length === 0) {
        res.status(404).json({ message: "No data found" });
      } else {
        const appointments = await generateData(rows);
        const sections = Object.keys(appointments).sort();

        const pdfData = [];
        for (const section of sections) {
          const appointment = appointments[section];
          pdfData.push({
            title: `${lvlTerm} ${section}`,
            schedule: appointment,
          });
        }
        const filename = await createPDFStd(pdfData, lvlTerm);

        console.log(filename);

        // res.status(200).json({ message: "PDF generated", appointments });
      }
    } catch (err) {
      next(err);
    }
  }

  fs.access(outputDir, fs.constants.F_OK, (err) => {
    if (err) {
      next(err);
      return;
    }

    res.status(200).sendFile(outputDir);
  });
}

export async function serveTeacherPDF(req, res, next) {
  const initial = req.params.initial;
  var outputDir = path.resolve(__dirname, "routine_" + initial + ".pdf");

  fs.access(outputDir, fs.constants.F_OK, (err) => {
    if (err) {
      next(err);
      return;
    }

    res.status(200).sendFile(outputDir);
  });
}

export async function serveRoomPDF(req, res, next) {
  const room = req.params.room;
  var outputDir = path.resolve(__dirname, "routine_" + room + ".pdf");

  fs.access(outputDir, fs.constants.F_OK, (err) => {
    if (err) {
      next(err);
      return;
    }

    res.status(200).sendFile(outputDir);
  });
}

export async function getAllInitial(req, res, next) {
  try {
    const result = await getInitials();
    res.status(200).json({ initials: result });
  } catch (err) {
    next(err);
  }
}

export async function getAllIRooms(req, res, next) {
  try {
    const result = await getRooms();
    res.status(200).json({ rooms: result });
  } catch (err) {
    next(err);
  }
}


export async function getAllLevelTerm(req, res, next) {
  try {
    const result = await getLevelTerms();
    res.status(200).json(result.map((row) => row.level_term).sort());
  } catch (err) {
    next(err);
  }
}