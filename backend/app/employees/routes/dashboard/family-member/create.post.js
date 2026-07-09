export const url = '/dashboard/employees/:employee_id/family'

import FamilyMember from "#app/employees/models/family-member.js"

export const controller = async (req, rep) => {

    const { employee_id } = req.params
    const { body } = req

    const doc = new FamilyMember({
        ...body,
        employee_id
    })

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import UpsertSchema from "#app/employees/schemas/family-member/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('employee_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpsertSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('employees.update')
        .on('pre-handler'),
]
