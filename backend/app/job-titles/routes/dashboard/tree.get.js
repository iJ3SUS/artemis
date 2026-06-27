export const url = '/dashboard/job-titles/tree'

import JobTitle from "#app/job-titles/models/job-title.js"
import Employee from "#app/employees/models/employee.js"
import { ObjectId } from 'lemon-api/plugins/mongodb'

export const controller = async (req, rep) => {

    const [jobTitles, employeeCounts] = await Promise.all([
        JobTitle.query()
            .sort({ level: 1, name: 1 })
            .get(),

        Employee.query([
            { $match: { active: true } },
            { $group: { _id: '$job_title_id', count: { $sum: 1 } } }
        ]).get()
    ])

    const countMap = new Map()
    employeeCounts.forEach(ec => {
        const id = ec._id instanceof ObjectId ? ec._id.toString() : String(ec._id)
        countMap.set(id, ec.count)
    })

    const map = new Map()
    const roots = []

    jobTitles.forEach(jt => {
        const node = { ...jt, children: [], employee_count: 0 }
        const id = node._id instanceof ObjectId ? node._id.toString() : node._id
        node.employee_count = countMap.get(id) || 0
        map.set(id, node)
    })

    map.forEach(node => {
        if (node.parent_id) {
            const parentId = node.parent_id instanceof ObjectId
                ? node.parent_id.toString()
                : node.parent_id
            const parent = map.get(parentId)
            if (parent) {
                parent.children.push(node)
            } else {
                roots.push(node)
            }
        } else {
            roots.push(node)
        }
    })

    return rep.send(roots)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('job-titles.tree')
        .on('pre-handler'),
]
