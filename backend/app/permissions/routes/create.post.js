export const url = '/dashboard/permissions'

import Permission from "../models/permission.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new Permission(body)

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import PermissionCreateSchema from "#app/permissions/schemas/create.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(PermissionCreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e intentalo de nuevo."),

    new CanMiddleware('permissions.create')
        .on('pre-handler'),
]
