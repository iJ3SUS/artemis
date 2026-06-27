export const url = '/dashboard/employees/list'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const result = await Employee.query()
        .match({ active: true })
        .sort({ names: 1, surnames: 1 })
        .get()

    return rep.send(result)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('employees.list')
        .on('pre-handler'),
]
