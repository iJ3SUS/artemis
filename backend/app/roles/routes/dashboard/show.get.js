export const url = '/dashboard/roles/:role_id'

import Role from "#app/roles/models/role.js"

export const controller = async (req, rep) => {

    const { role_id } = req.params

    const role = await Role.query()
        .match({ _id: role_id })
        .first()

    if (!role) {
        return rep.status(404).send({
            message: 'Rol no encontrado'
        })
    }

    return rep.send(role)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('role_id'),

    new CanMiddleware('roles.show')
        .on('pre-handler'),
]
