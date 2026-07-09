export const url = '/dashboard/disabilities'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

    const result = await Disability.query()
        .when(search, (q) => {
            const searchNumber = isNaN(parseInt(search)) ? undefined : parseInt(search)
            const or = [
                { notes: { $regex: search, $options: 'i' } }
            ]
            if (searchNumber !== undefined) {
                or.unshift({ number: searchNumber })
            }
            q.match({ $or: or })
        })
        .sort({ number: -1 })
        .paginate(page || 1, limit || 15)

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('disabilities.browse')
        .on('pre-handler'),
]
