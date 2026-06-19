export const url = '/dashboard/users'

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new User(body)

    doc.password = null
    doc.hash = doc.randomHash()

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ExistsMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import CreateSchema from "#app/users/schemas/create.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    
    // new CanMiddleware('users.create')
    //     .on('pre-handler'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new ExistsMiddleware()
        .on('pre-handler')
        .collection('users')
        .message("Ya existe un usuario con este correo electrónico")
        .criteria(
            ({ body }) => {
                return {
                    email: { $regex: `^${body.email}$`, $options: 'i' }
                }
            }
        ),

    new ExistsMiddleware()
        .on('pre-handler')
        .collection('users')
        .message("Ya existe un usuario con este número de identificación")
        .criteria(
            ({ body }) => {
                return {
                    identification: { $regex: `^${body.identification}$`, $options: 'i' }
                }
            }
        ),

]
