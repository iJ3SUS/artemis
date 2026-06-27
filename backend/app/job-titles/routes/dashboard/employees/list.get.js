export const url = '/dashboard/job-titles/:job_title_id/employees'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { job_title_id } = req.params

    const result = await Employee.query()
        .match({ job_title_id })
        .sort({ names: 1, surnames: 1 })
        .get()

    return rep.send(result)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('job_title_id'),

    new CanMiddleware('job-titles.employees')
        .on('pre-handler'),
]
