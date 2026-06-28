export const url = '/dashboard/permissions/:_id'

import Permission from "../models/permission.js"

export const controller = async (req, rep) => {

    const { _id } = req.params

    const doc = await Permission.query()
        .match({ _id })
        .first()

    if (!doc) {
        return rep.status(404).send({
            message: 'Permiso no encontrado'
        })
    }

    await doc.delete()

    return rep.send({
        message: 'Permiso eliminado correctamente'
    })

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new CanMiddleware('permissions.delete')
        .on('pre-handler'),
]
