export const url = '/dashboard/job-titles/list'

import JobTitle from "#app/job-titles/models/job-title.js"

export const controller = async (req, rep) => {

    const jobTitles = await JobTitle.query()
        .match({ active: true })
        .get()

    return rep.send(jobTitles)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
