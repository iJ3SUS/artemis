export const url = '/dashboard/employees/:employee_id'

import Employee from "#app/employees/models/employee.js"

export const controller = async (req, rep) => {

    const { employee_id } = req.params

    const employee = await Employee.query()
        .match({ _id: employee_id })
        .first()

    if (!employee) {
        return rep.status(404).send({
            message: 'Empleado no encontrado'
        })
    }

    await employee.delete()

    return rep.status(204).send()

}

import { AuthMiddleware, ParseOidMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),
    new ParseOidMiddleware()
        .on('employee_id')
]
