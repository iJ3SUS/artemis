export const url = '/dashboard/employees'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { body } = req

    const doc = new Employee(body)

    const response = await doc.save()

    return rep.send(response)

}

import { AuthMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import CreateSchema from "#app/employees/schemas/create.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),
]
