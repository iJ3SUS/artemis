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

    employee.fill({ salary })

    await employee.save()

    const history = new SalaryHistory({
        employee_id: employee._id,
        job_title_id: employee.job_title_id || null,
        salary,
        reason: reason || ''
    })
    
    await history.save()

    return rep.send({
        message: 'Salario actualizado correctamente',
        resource_id: history._id
    })

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
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

    new CanMiddleware('employees.salary.update')
        .on('pre-handler'),
]
