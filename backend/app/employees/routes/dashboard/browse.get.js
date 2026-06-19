export const url = '/dashboard/employees'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { page, limit, search } = req.query

    const pipelines = req.pipelines ?? []

    if (search) {
        pipelines.push({
            $match: {
                $or: [
                    { names: { $regex: search, $options: 'i' } },
                    { surnames: { $regex: search, $options: 'i' } },
                    { identification: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
        })
    }

    const result = await Employee.query(pipelines)
        .paginate(page || 1, limit || 10)

    return rep.send(result)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
