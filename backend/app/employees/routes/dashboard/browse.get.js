export const url = '/dashboard/employees'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { page, limit, search, active, job_title_id } = req.query

    const result = await Employee.query()
        .when(search, (q) => {
            q.match({
                $or: [
                    { display_name: { $regex: search, $options: 'i' } },
                    { identification: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            })
        })
        .when(active !== undefined, (q) => q.match({ active }))
        .when(job_title_id, (q) => q.match({ job_title_id }))
        .paginate(page || 1, limit || 10)

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import BrowseSchema from "#app/employees/schemas/browse.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(BrowseSchema),

    new CanMiddleware('employees.browse')
        .on('pre-handler'),
]
