import { getFormByUUID, getForms,updateForm } from './repository.js'

export async function getForm(req, res, next) {
    const uuid = req.params['uuid']

    try {
        const form = await getFormByUUID(uuid);

        res.status(200).json({ data: form })

    } catch (err) {
        next(err)
    }
}

export async function getAllForm(req, res, next) {
    try {
        const form = await getForms();

        res.status(200).json({ data: form })

    } catch (err) {
        next(err)
    }

}

export async function editForm(req, res, next) {

    const uuid = req.params['uuid']
    let response = req.body.preferences
    //make response a string
    response = JSON.stringify(response)

    try {
        const form = await updateForm(uuid,response);

        res.status(200).json({msg:"Successfully Updated"})

    } catch (err) {
        next(err)
    }

}