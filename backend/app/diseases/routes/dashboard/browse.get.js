export const url = '/dashboard/diseases'

import Disease from "#app/diseases/models/Disease.js"

export const controller = async (req, rep) => {

    const { keyword } = req.query

    const diseases = await Disease.query()
        .when(keyword, (q) => {
            q.match({
                $or: [
                    { code: { $regex: keyword, $options: 'i' } },
                    { name: { $regex: keyword, $options: 'i' } }
                ]
            })
        })
        .limit(20)
        .get()

    return rep.send(diseases)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('diseases.browse')
        .on('pre-handler'),
]
