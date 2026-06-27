export const url = '/dashboard/roles'

import Role from "#app/roles/models/role.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

    const result = await Role.query()
        //.match({ name: { $ne: 'IAD' } })
        .when(search, (q) => {
            q.match({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            })
        })
        .paginate(page || 1, limit || 10)

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('roles.browse')
        .on('pre-handler'),
]
