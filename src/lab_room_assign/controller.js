import { getAllRoom, getAllCourse } from './repository.js'

export const getAllLabRoom = async (req, res, next) => {
    try {
        const rooms = await getAllRoom()
        res.status(200).json(rooms)
    } catch (err) {
        console.error(err)
    }
}

export const getAllLabCourse = async (req, res, next) => {
    try {
        const courses = await getAllCourse()
        res.status(200).json(courses)
    } catch (err) {
        console.error(err)
    }
}