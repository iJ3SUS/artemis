export const url = '/dashboard/users/:user_id/password'

import Hash from "#src/plugins/hash.js"
import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { user_id } = req.params
    const { password } = req.body

    const user = await User.query()
        .match({ _id: user_id })
        .first()

    if (!user) {
        return rep.status(404).send({
            message: 'Usuario no encontrado'
        })
    }

    const hash = await Hash.make(password)

    await user.update({ password: hash })

    return rep.send({
        message: 'Contraseña actualizada correctamente'
    })

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import PasswordSchema from "#app/users/schemas/password.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('user_id'),
    new ValidateMiddleware()
        .on('pre-handler')
        .schema(PasswordSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
