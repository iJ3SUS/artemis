export const url = '/dashboard/disabilities/:_id'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body } = req

    const disability = await Disability.query()
        .match({ _id: _id })
        .first()

    if (!disability) {
        return rep.status(404).send({
            message: 'Incapacidad no encontrada'
        })
    }

    disability.fill(body)

    const response = await disability.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/disabilities/schemas/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('disabilities.update')
        .on('pre-handler'),
]
