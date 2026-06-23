export const url = '/dashboard/charts/employees/job-title'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const result = await Employee.query([
        { $match: { active: true } },
        {
            $lookup: {
                from: 'job_titles',
                localField: 'job_title_id',
                foreignField: '_id',
                as: 'job_title'
            }
        },
        { $unwind: { path: '$job_title', preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: '$job_title_id',
                name: { $first: '$job_title.name' },
                count: { $sum: 1 }
            }
        },
        { $project: { _id: 0, job_title_id: '$_id', name: 1, count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 15 }
    ])
        .get()

    return rep.send(result)

}

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
