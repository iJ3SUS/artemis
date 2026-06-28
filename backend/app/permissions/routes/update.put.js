export const url = '/dashboard/permissions/:_id'

import Permission from "../models/permission.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body } = req

    const doc = await Permission.query()
        .match({ _id })
        .first()

    if (!doc) {
        return rep.status(404).send({
            message: 'Permiso no encontrado'
        })
    }

    doc.fill(body)

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import PermissionUpsertSchema from "#app/permissions/schemas/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(PermissionUpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e intentalo de nuevo."),

    new CanMiddleware('permissions.update')
        .on('pre-handler'),
]
