export const url = '/dashboard/users'

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

    const pipelines = req.pipelines ?? []

    if (search) {
        pipelines.push({
            $match: {
                $or: [
                    { names: { $regex: search, $options: 'i' } },
                    { surnames: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { identification: { $regex: search, $options: 'i' } }
                ]
            }
        })
    }

    const result = await User.query(pipelines)
        .limit(limit || 10)
        .paginate()

    return rep.send(result)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
