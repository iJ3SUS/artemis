export const url = '/dashboard/disabilities'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new Disability(body)

    doc.number = await Disability.nextNumber()

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/disabilities/schemas/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('disabilities.create')
        .on('pre-handler'),
]
