export const url = '/dashboard/employees'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

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
        .paginate(page || 1, limit || 10)

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('employees.browse')
        .on('pre-handler'),
]
