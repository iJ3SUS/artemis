export const url = '/dashboard/users'

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

    const result = await User.query()
        .when(search, (q) => {
            q.match({
                $or: [
                    { display_name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { identification: { $regex: search, $options: 'i' } }
                ]
            })
        })
        .paginate(page || 1, limit || 10)

    return rep.send(result)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
