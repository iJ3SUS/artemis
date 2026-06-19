export const url = '/dashboard/employees/:_id'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body } = req

    const employee = await Employee.query()
        .match({ _id: _id })
        .first()

    if (!employee) {
        return rep.status(404).send({
            message: 'Empleado no encontrado'
        })
    }

    employee.fill(body)

    const response = await employee.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import UpdateSchema from "#app/employees/schemas/update.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpdateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
