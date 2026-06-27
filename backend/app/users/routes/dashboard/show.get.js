export const url = '/dashboard/users/:user_id'

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { user_id } = req.params

    const user = await User.query()
        .match({ _id: user_id })
        .first()

    if (!user) {
        return rep.status(404).send({
            message: 'Usuario no encontrado'
        })
    }

    return rep.send(user)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('user_id'),

    new CanMiddleware('users.show')
        .on('pre-handler'),
]
