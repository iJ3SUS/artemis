export const url = '/dashboard/permissions'

import Permission from "../models/permission.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

    const result = await Permission.query()
        .when(search, (q) => {
            q.match({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { key: { $regex: search, $options: 'i' } },
                    { module: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ]
            })
        })
        .sort({ module: 1, name: 1 })
        .paginate(page || 1, limit || 10)

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    
    new CanMiddleware('permissions.browse')
        .on('pre-handler')
]
