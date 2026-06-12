export const url = '/dashboard/permissions'

import Permission from "../models/permission.js"

export const controller = async (req, rep) => {

    const { page, limit } = req.query

    const pipelines = req.pipelines ?? []

    const docs = await Permission.query(pipelines)
        .get()

    return rep.send(docs)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    
    // new CanMiddleware('permissions.browse')
    //     .on('pre-handler')
]
