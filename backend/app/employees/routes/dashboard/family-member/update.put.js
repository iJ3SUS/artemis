export const url = '/dashboard/employees/:employee_id/family/:id'

import FamilyMember from "#app/employees/models/family-member.js"

export const controller = async (req, rep) => {

    const { employee_id, id } = req.params
    const { body } = req

    const member = await FamilyMember.query()
        .match({ _id: id, employee_id })
        .first()

    if (!member) {
        return rep.status(404).send({
            message: 'Familiar no encontrado'
        })
    }

    member.fill(body)

    const response = await member.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/employees/schemas/family-member/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
        
    new ParseOidMiddleware()
        .on('employee_id')
        .on('id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('employees.update')
        .on('pre-handler'),
]
