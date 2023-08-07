
import { getAll,saveCourse,updateCourse,removeCourse } from "./repository.js";


export async function getAllCourse(req, res, next) {
    try {
        const Courses = await getAll();
        console.log(Courses)
        res.status(200).json(Courses);
    } catch(err) {
        console.error(err);
    }
}


export async function addCourse(req, res, next) {

    const course_id = req.body.course_id
    const name = req.body.name
    const type = req.body.type
    const session = req.body.session
    const class_per_week = req.body.class_per_week
    const batch = req.body.batch
    const sections = req.body.sections
    
    const Course = {
        course_id: course_id,
        name: name,
        type: type,
        session: session,
        class_per_week: class_per_week,
        batch:batch,
        sections:sections,
        
    }

    try {
        const rowCount = await saveCourse(Course);
        res.status(200).json({message: "Successfully Saved"});

    } catch(err) {
        console.error(err);
        next(err)
    }

}


export async function editCourse(req, res, next) {
    const course_id_old = req.params['course_id']
    
    const course_id = req.body.course_id
    const name = req.body.name
    const type = req.body.type
    const session = req.body.session
    const class_per_week = req.body.class_per_week
    const batch = req.body.batch
    const sections = req.body.sections
    
    const Course = {
        course_id_old:course_id_old,
        course_id: course_id,
        name: name,
        type: type,
        session: session,
        class_per_week: class_per_week,
        batch:batch,
        sections:sections,
        
    }
    
    
    try{
        const rowCount = await updateCourse(Course)
        res.status(200).json({ Course:Course })

    }catch(err) {
        console.error(err);
        next(err)
    }

}

export async function deleteCourse(req, res, next) {
    const course_id = req.params['course_id']
    try{
        const rowCount = await removeCourse(course_id)
        res.status(200).json({ row:rowCount })

    }catch(err) {
        console.error(err);
    }
}