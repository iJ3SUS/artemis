export const url = '/dashboard/users'

import Hash from "#src/plugins/hash.js"
import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { names, surnames, display_name, email, phone, active, identification, properties, roles, password } = req.body

    const existing = await User.query()
        .match({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
        .first()

    if (existing) {
        return rep.status(409).send({
            message: 'Ya existe un usuario con ese correo electrónico'
        })
    }

    const hash = await Hash.make(password)

    const user = await User.create({
        names,
        surnames,
        display_name,
        email,
        phone,
        active,
        identification,
        properties,
        roles,
        password: hash
    })

    return rep.status(201).send(user)

}

import { AuthMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import CreateSchema from "#app/users/schemas/create.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
