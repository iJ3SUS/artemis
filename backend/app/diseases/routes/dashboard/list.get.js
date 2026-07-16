export const url = '/dashboard/diseases/list'

import Disease from "#app/diseases/models/Disease.js"

export const controller = async (req, rep) => {

    const { limit, search } = req.query

    const result = await Disease.query()
        .when(search, (q) => q.match({
            $or: [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ]
        }))
        .limit(limit || 20)
        .sort({ code: 1 })
        .get()

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('diseases.list')
        .on('pre-handler'),
]
