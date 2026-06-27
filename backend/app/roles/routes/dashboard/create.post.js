export const url = '/dashboard/roles'

import Role from "#app/roles/models/role.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new Role(body)

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware, ExistsMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import RoleSchema from "#app/roles/schemas/role.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(RoleSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e intentalo de nuevo."),

    new ExistsMiddleware()
        .on('pre-handler')
        .collection('roles')
        .message("Ya existe un rol con este nombre")
        .criteria(
            ({ body }) => {
                return {
                    name: { $regex: '^' + body.name + '$', $options: 'i' }
                }
            }
        ),

    new CanMiddleware('roles.create')
        .on('pre-handler'),
]
