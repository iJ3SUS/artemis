export const url = '/dashboard/job-titles/tree'

import JobTitle from "#app/job-titles/models/job-title.js"
import { ObjectId } from 'lemon-api/plugins/mongodb'

export const controller = async (req, rep) => {

    const jobTitles = await JobTitle.query()
        .sort({ level: 1, name: 1 })
        .get()

    const map = new Map()
    const roots = []

    jobTitles.forEach(jt => {
        const node = { ...jt, children: [] }
        const id = node._id instanceof ObjectId ? node._id.toString() : node._id
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

import { AuthMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso")
]
