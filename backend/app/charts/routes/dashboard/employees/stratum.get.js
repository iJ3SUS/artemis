export const url = '/dashboard/charts/employees/stratum'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const result = await Employee.query([
        { $match: { active: true } },
        { $group: { _id: '$stratum', count: { $sum: 1 } } },
        { $project: { _id: 0, stratum: '$_id', count: 1 } },
        { $sort: { stratum: 1 } }
    ])
        .get()

    return rep.send(result)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
