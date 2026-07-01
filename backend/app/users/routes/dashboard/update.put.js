export const url = '/dashboard/users/:_id'

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body } = req

    const user = await User.query()
        .match({ _id: _id })
        .first()

    if (!user) {
        return rep.status(404).send({
            message: 'Usuario no encontrado'
        })
    }

    user.fill(body)

    const response = await user.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/users/schemas/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('users.update')
        .on('pre-handler'),
]
