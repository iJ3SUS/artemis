export const url = '/dashboard/job-titles/:job_title_id'

import JobTitle from "#app/job-titles/models/job-title.js"

export const controller = async (req, rep) => {

    const { job_title_id } = req.params

    const jobTitle = await JobTitle.query()
        .match({ _id: job_title_id })
        .first()

    if (!jobTitle) {
        return rep.status(404).send({
            message: 'Cargo no encontrado'
        })
    }

    return rep.send(jobTitle)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('job_title_id'),

    new CanMiddleware('job-titles.show')
        .on('pre-handler'),
]
