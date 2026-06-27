export const url = '/dashboard/charts/employees/age-range'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const current_year = new Date().getFullYear()

    const result = await Employee.query([
        { $match: { active: true } },
        {
            $addFields: {
                age: { $subtract: [current_year, { $year: '$birth_date' }] }
            }
        },
        {
            $addFields: {
                age_range: {
                    $switch: {
                        branches: [
                            { case: { $and: [{ $gte: ['$age', 18] }, { $lte: ['$age', 25] }] }, then: '18-25' },
                            { case: { $and: [{ $gte: ['$age', 26] }, { $lte: ['$age', 35] }] }, then: '26-35' },
                            { case: { $and: [{ $gte: ['$age', 36] }, { $lte: ['$age', 45] }] }, then: '36-45' },
                            { case: { $and: [{ $gte: ['$age', 46] }, { $lte: ['$age', 55] }] }, then: '46-55' },
                        ],
                        default: '56+'
                    }
                }
            }
        },
        {
            $group: {
                _id: '$age_range',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                range: '$_id',
                count: 1
            }
        },
        { $sort: { range: 1 } }
    ])
        .get()

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('charts.employees.age-range')
        .on('pre-handler'),
]
