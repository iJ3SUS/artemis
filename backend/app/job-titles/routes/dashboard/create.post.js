export const url = '/dashboard/job-titles'

import JobTitle from "#app/job-titles/models/job-title.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new JobTitle(body)

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import CreateSchema from "#app/job-titles/schemas/create.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),
]
