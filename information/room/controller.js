import {getAll, removeRoom, saveRoom, updateRoom } from "./repository.js"


export async function getAllRoom(req, res, next) {

    try {
        const rooms = await getAll()
        res.status(200).json(rooms)
    } catch (err) {
        console.error(err)
    }



}

export async function addRoom(req, res, next) {

    const room = req.body.room
    const type = req.body.type

    const rooms = {
        room: room,
        type: type
    }

    try {
        const room = await saveRoom(rooms)
        res.status(200).json(room)
    } catch (err) {
        console.error(err)
    }

}


export async function editRoom(req, res, next) {

    const room = req.params['room']

    const type = req.body.type

    const rooms = {
        room: room,
        type: type
    }

    try {
        const room = await updateRoom(rooms)
        res.status(200).json(room)
    } catch (err) {
        console.error(err)
    }

}

export async function deleteRoom(req, res, next) {

    const room = req.params['room']


    try {
        const rooms = await removeRoom(room)
        res.status(200).json(rooms)
    } catch (err) {
        console.error(err)
    }

}