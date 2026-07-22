export const url = '/dashboard/job-titles/:_id/print'

import { ObjectId } from 'lemon-api/plugins/mongodb'
import JobTitle from "#app/job-titles/models/job-title.js"
import Employee from "#app/employees/models/employee.js"
import Pdf from "#plugins/pdf.js"
import Html from "#plugins/html.js"

const contractLabels = { 1: 'Fijo', 2: 'Indefinido', 3: 'Obra labor', 4: 'Prestación de servicios' }
const educationLabels = { primary: 'Primaria', secondary: 'Secundaria', technical: 'Técnico', technologist: 'Tecnólogo', professional: 'Profesional', specialization: 'Especialización', master: 'Maestría', doctorate: 'Doctorado' }

const fmtDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { employee_id } = req.query

    const jt = await JobTitle.query()
        .match({ _id: _id })
        .first()

    if (!jt) {
        return rep.status(404).send({
            message: 'Cargo no encontrado'
        })
    }

    let emp = null
    if (employee_id) {
        emp = await Employee.query()
            .match({ _id: new ObjectId(employee_id) })
            .first()
    }

    const empPhone = emp?.phone ? `${emp.phone.indicative || ''} ${emp.phone.number || ''}`.trim() : null

    const emergencyContact = emp ? [
        emp.emergency_contact?.name,
        emp.emergency_contact?.relationship ? `(${emp.emergency_contact.relationship})` : null,
        emp.emergency_contact?.phone ? `· ${emp.emergency_contact.phone}` : null,
    ].filter(Boolean).join(' ') || '-' : null

    const now = new Date()

    const html = await new Html()
        .from('app/job-titles/templates/print.ejs')
        .render({
            jt,
            emp,
            empPhone,
            emergencyContact,
            contractLabels,
            educationLabels,
            fmtDate,
            generatedAt: now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
            generatedAtFull: now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        })

    const buffer = await new Pdf()
        .fromHtml(html)
        .options({
            pageSize: 'A4',
            marginTop: '12mm',
            marginBottom: '12mm',
            marginLeft: '10mm',
            marginRight: '10mm',
            enableLocalFileAccess: true,
        })
        .generate()

    const filename = jt.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    rep.header('Content-Type', 'application/pdf')
    rep.header('Content-Disposition', `inline; filename="${filename}.pdf"`)
    rep.send(buffer)

}

import { AuthMiddleware, ParseOidMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new CanMiddleware('job-titles.show')
        .on('pre-handler'),
]
