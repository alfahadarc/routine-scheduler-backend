
import { getAll, removeTeacher, saveTeacher, updateTeacher,findByInitial } from "./repository.js";


export async function getAllTeacher(req, res, next) {
    try {
        const teachers = await getAll();
        console.log(teachers)
        res.status(200).json(teachers);
    } catch(err) {
        console.error(err);
    }
}

export async function getTeacher(req,res,next){
    const initial = req.params['initial']
    try{
        const teacher = await findByInitial(initial)
        console.log(teacher)
        res.status(200).json(teacher);

    } catch(err) {
        console.error(err);
        res.status(200).json({msg:err.message});

    }
}

export async function addTeacher(req, res, next) {

    //initial, name,surname,email,seniority_rank,active,theory_courses, sessional_courses
    const initial = req.body.initial
    const name = req.body.name
    const surname = req.body.surname
    const email = req.body.email
    const seniority_rank = req.body.seniority_rank
    const active = req.body.active
    const theory_courses = req.body.theory_courses
    const sessional_courses = req.body.sessional_courses

    const teacher = {
        initial: initial,
        name: name,
        surname: surname,
        email: email,
        seniority_rank: seniority_rank,
        active: active,
        theory_courses: theory_courses,
        sessional_courses: sessional_courses
    }

    try {
        const rowCount = await saveTeacher(teacher);
        res.status(200).json({message: "success"});

    } catch(err) {
        console.error(err);
    }

}


export async function editTeacher(req, res, next) {
    const initial = req.params['initial']
    
    const name = req.body.name
    const surname = req.body.surname
    const email = req.body.email
    const seniority_rank = req.body.seniority_rank
    const active = req.body.active
    const theory_courses = req.body.theory_courses
    const sessional_courses = req.body.sessional_courses
    
    const teacher = {
        initial: initial,
        name: name,
        surname: surname,
        email: email,
        seniority_rank: seniority_rank,
        active: active,
        theory_courses: theory_courses,
        sessional_courses: sessional_courses
    }
    
    
    try{
        const rowCount = await updateTeacher(teacher)
        res.status(200).json({ teacher:teacher })

    }catch(err) {
        console.error(err);
    }

}

export async function deleteTeacher(req, res, next) {
    const initial = req.params['initial']
    try{
        const rowCount = await removeTeacher(initial)
        res.status(200).json({ row:rowCount })

    }catch(err) {
        console.error(err);
    }
}