export const url = '/dashboard/roles/list'

import Role from "#app/roles/models/role.js"

export const controller = async (req, rep) => {

    const roles = await Role.query()
        //.match({ name: { $ne: 'IAD' } })
        .get()

    return rep.send(roles)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('roles.list')
        .on('pre-handler'),
]
