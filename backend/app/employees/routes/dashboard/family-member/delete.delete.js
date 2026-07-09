export const url = '/dashboard/employees/:employee_id/family/:id'

import FamilyMember from "#app/employees/models/family-member.js"

export const controller = async (req, rep) => {

    const { employee_id, id } = req.params

    const member = await FamilyMember.query()
        .match({ _id: id, employee_id })
        .first()

    if (!member) {
        return rep.status(404).send({
            message: 'Familiar no encontrado'
        })
    }

    await member.delete()

    return rep.status(204).send()

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('employee_id')
        .on('id'),

    new CanMiddleware('employees.update')
        .on('pre-handler'),
]
