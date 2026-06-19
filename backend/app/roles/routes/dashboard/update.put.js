export const url = '/dashboard/roles/:_id'

import Role from "#app/roles/models/role.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body } = req

    const role = await Role.query()
        .match({ _id: _id })
        .first()

    if (!role) {
        return rep.status(404).send({
            message: 'Rol no encontrado'
        })
    }

    role.fill(body)

    const response = await role.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import RoleSchema from "#app/roles/schemas/role.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(RoleSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e intentalo de nuevo.")
]
