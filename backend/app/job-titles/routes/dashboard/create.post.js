export const url = '/dashboard/job-titles'

import JobTitle from "#app/job-titles/models/job-title.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new JobTitle(body)

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/job-titles/schemas/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('job-titles.create')
        .on('pre-handler'),
]
