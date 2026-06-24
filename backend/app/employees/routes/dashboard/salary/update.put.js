export const url = '/dashboard/employees/:employee_id/salary'

import Employee from "#app/employees/models/employee.js"
import SalaryHistory from "#app/employees/models/salary-history.js"

export const controller = async (req, rep) => {

    const { employee_id } = req.params
    const { salary, reason } = req.body

    const employee = await Employee.query()
        .match({ _id: employee_id })
        .first()

    if (!employee) {
        return rep.status(404).send({
            message: 'Empleado no encontrado'
        })
    }

    const previous_salary = employee.salary || 0

    employee.fill({ salary })
    await employee.save()

    const history = new SalaryHistory({
        employee_id: employee._id,
        job_title_id: employee.job_title_id || null,
        previous_salary,
        new_salary: salary,
        reason: reason || ''
    })
    await history.save()

    return rep.send({
        employee,
        history
    })

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware } from "#src/middlewares/index.js"
import UpdateSalarySchema from "#app/employees/schemas/salary/upsert.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('employee_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpdateSalarySchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),
]
