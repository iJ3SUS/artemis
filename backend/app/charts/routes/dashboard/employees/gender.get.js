export const url = '/dashboard/charts/employees/gender'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const result = await Employee.query([
        { $match: { active: true } },
        { $group: { _id: '$gender', count: { $sum: 1 } } },
        { $project: { _id: 0, gender: '$_id', count: 1 } },
        { $sort: { gender: 1 } }
    ])
        .get()

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('charts.employees.gender')
        .on('pre-handler'),
]
