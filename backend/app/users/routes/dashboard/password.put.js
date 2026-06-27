export const url = '/dashboard/users/:user_id/password'

import User from "#app/users/models/user.js"
import Hash from "#src/plugins/hash.js"

export const controller = async (req, rep) => {

    const { body, params } = req

    const doc = await User.query()
        .match({ _id: params.user_id })
        .first()

    if (!doc) {
        return rep.status(404).send({
            message: 'Usuario no encontrado'
        })
    }

    doc.password = await Hash.encrypt(body.password)
    doc.hash = doc.randomHash()

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import PasswordSchema from "#app/users/schemas/password.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('user_id'),
    new ValidateMiddleware()
        .on('pre-handler')
        .schema(PasswordSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('users.password')
        .on('pre-handler'),
]
