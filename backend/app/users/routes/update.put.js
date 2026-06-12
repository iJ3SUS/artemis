export const url = '/dashboard/users/:user_id'

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { user_id } = req.params
    const { email, roles, ...data } = req.body

    const user = await User.query()
        .match({ _id: user_id })
        .first()

    if (!user) {
        return rep.status(404).send({
            message: 'Usuario no encontrado'
        })
    }

    if (email && email !== user.email) {
        const existing = await User.query()
            .match({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
            .first()

        if (existing) {
            return rep.status(409).send({
                message: 'Ya existe un usuario con ese correo electrónico'
            })
        }
    }

    await user.update({
        ...data,
        ...(email && { email }),
        ...(roles && { roles })
    })

    return rep.send(user)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import UpdateSchema from "#app/users/schemas/update.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('user_id'),
    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpdateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
