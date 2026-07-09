export const url = '/dashboard/disabilities/list'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const disabilities = await Disability.query()
        .match({ active: true })
        .sort({ number: -1 })
        .get()

    return rep.send(disabilities)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('disabilities.list')
        .on('pre-handler'),
]
