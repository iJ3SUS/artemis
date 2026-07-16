export const url = '/dashboard/employees/list'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { job_title_id, active, limit, search } = req.query

    const result = await Employee.query()
        .when(job_title_id, (q) => q.match({ job_title_id: job_title_id }))
        .when(active !== undefined, (q) => q.match({ active }))
        .when(search, (q) => q.match({
            $or: [
                { display_name: { $regex: search, $options: 'i' } },
                { identification: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }))
        .project({ _id: 1, display_name: 1, identification: 1, email: 1, job_title_id: 1 })
        .limit(limit || 20)
        .sort({ display_name: 1 })
        .get()

    return rep.send(result)

}

import { AuthMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import ListSchema from "#app/employees/schemas/list.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(ListSchema)
        .message("Parámetros de consulta inválidos"),

    new CanMiddleware('employees.list')
        .on('pre-handler'),
]
