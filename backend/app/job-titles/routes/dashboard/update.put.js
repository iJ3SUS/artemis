export const url = '/dashboard/job-titles/:_id'

import JobTitle from "#app/job-titles/models/job-title.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body } = req

    const jobTitle = await JobTitle.query()
        .match({ _id: _id })
        .first()

    if (!jobTitle) {
        return rep.status(404).send({
            message: 'Cargo no encontrado'
        })
    }

    jobTitle.fill(body)

    const response = await jobTitle.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/job-titles/schemas/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
