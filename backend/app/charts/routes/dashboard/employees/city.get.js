export const url = '/dashboard/charts/employees/city'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const result = await Employee.query([
        { $match: { active: true } },
        {
            $group: {
                _id: {
                    city_name: '$city.city_name',
                    state_name: '$city.state_name'
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                city_name: '$_id.city_name',
                state_name: '$_id.state_name',
                count: 1
            }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
    ])
        .get()

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('charts.employees.city')
        .on('pre-handler'),
]
