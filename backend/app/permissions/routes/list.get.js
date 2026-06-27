export const url = '/dashboard/permissions/list'

import Permission from "../models/permission.js"

export const controller = async (req, rep) => {

    const docs = await Permission.query()
        .sort({ module: 1, name: 1 })
        .get()

    return rep.send(docs)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
