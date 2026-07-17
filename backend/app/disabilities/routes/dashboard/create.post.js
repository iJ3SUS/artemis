export const url = '/dashboard/disabilities'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const { body, user } = req

    const doc = new Disability(body)

    doc.number = await Disability.nextNumber()

    doc.status = {
        _id: doc.uuid(),
        date: new Date(),
        stage: 1,
        user: {
            _id: user._id,
            display_name: user.display_name,
        },
        observation: body.notes || '',
    }

    doc.timeline = [
        doc.status
    ]

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import CreateSchema from "#app/disabilities/schemas/create.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('disabilities.create')
        .on('pre-handler'),
]
