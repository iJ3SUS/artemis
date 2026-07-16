export const url = '/dashboard/disabilities/:disability_id'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const { disability_id } = req.params

    const disability = await Disability.query()
        .match({ _id: disability_id })
        .first()

    if (!disability) {
        return rep.status(404).send({
            message: 'Incapacidad no encontrada'
        })
    }

    return rep.send(disability)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('disability_id'),

    new CanMiddleware('disabilities.show')
        .on('pre-handler'),
]
