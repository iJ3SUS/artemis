export const url = '/dashboard/employees/:employee_id/family'

import FamilyMember from "#app/employees/models/family-member.js"

export const controller = async (req, rep) => {

    const { employee_id } = req.params

    const members = await FamilyMember.query()
        .match({ employee_id })
        .sort({ created_at: -1 })
        .get()

    return rep.send(members)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('employee_id'),

    new CanMiddleware('employees.show')
        .on('pre-handler'),
]
