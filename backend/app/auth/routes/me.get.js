export const url = '/auth/me'


export const controller = async (req, rep) => {
  
    return rep.send(req.user)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
