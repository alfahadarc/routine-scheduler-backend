import { getAll, saveSection, updateSection, removeSection } from "./repository.js";

export async function getAllSection(req, res, next) {
    try {
        const sections = await getAll();
        res.status(200).json(sections)

    } catch (err) {
        console.error(err)
    }
}

export async function addSection(req, res, next) {

    const section = {
        batch: req.body.batch,
        section: req.body.section,
        type: req.body.type,
        room: req.body.room === "000" ? null : req.body.room,
        session: req.body.session
    }

    try {
        const rows = await saveSection(section);

        res.status(200).json({ msg: "successful" })
    } catch (err) {
        console.error(err)
    }

}


export async function editSection(req, res, next) {
    const batch = req.params['batch']
    const section = req.params['section']

    const sections = {
        batch: batch,
        section: section,
        type: req.body.type,
        room: req.body.room === "000" ? null : req.body.room,
        session: req.body.session
    }

    try {
        const row = await updateSection(sections)
        res.status(200).json({ msg: "successful" })
    } catch (err) {
        console.error(err)
    }

}

export async function deleteSection(req, res, next) {
    const batch = req.params['batch']
    const section = req.params['section']

    try {
        const row = await removeSection(batch,section)
        res.status(200).json({ msg: "successful" })
    } catch (err) {
        console.error(err)
    }


}