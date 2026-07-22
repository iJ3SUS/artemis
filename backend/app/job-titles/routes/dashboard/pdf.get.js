export const url = '/dashboard/job-titles/pdf'

import JobTitle from "#app/job-titles/models/job-title.js"
import Pdf from "#plugins/pdf.js"

export const controller = async (req, rep) => {

    const { search } = req.query

    const jobTitles = await JobTitle.query()
        .when(search, (q) => {
            q.match({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { dependency: { $regex: search, $options: 'i' } }
                ]
            })
        })
        .sort({ name: 1 })
        .get()

    const rows = jobTitles.map((jt, i) => `
        <tr>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: center; font-size: 13px;">${i + 1}</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 13px; font-weight: 600; color: #111827;">${jt.name || '-'}</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 13px; color: #4b5563;">${jt.description || '-'}</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 13px; color: #4b5563;">${jt.dependency || '-'}</td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: center; font-size: 13px;">
                <span style="display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; ${jt.active ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #fee2e2; color: #991b1b;'}">${jt.active ? 'Activo' : 'Inactivo'}</span>
            </td>
        </tr>
    `).join('')

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cargos laborales</title>
    <style>
        @page { margin: 20mm 15mm; }
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #374151; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
        .header h1 { margin: 0; font-size: 24px; color: #1e3a8a; }
        .header p { margin: 4px 0 0; font-size: 13px; color: #6b7280; }
        .meta { margin-bottom: 20px; font-size: 12px; color: #6b7280; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 10px 12px; border: 1px solid #d1d5db; background-color: #2563eb; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
        td { padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 13px; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cargos laborales</h1>
        <p>Listado completo de cargos de la empresa</p>
    </div>
    <div class="meta">
        <span>Generado: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        <span>Total: ${jobTitles.length} cargo(s)</span>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width: 40px;">#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Dependencia</th>
                <th style="width: 80px;">Estado</th>
            </tr>
        </thead>
        <tbody>
            ${rows || '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #9ca3af;">No hay cargos registrados</td></tr>'}
        </tbody>
    </table>
    <div class="footer">
        Documento generado automáticamente por el sistema de Recursos Humanos
    </div>
</body>
</html>`

    const buffer = await new Pdf()
        .fromHtml(html)
        .options({
            pageSize: 'A4',
            marginTop: '15mm',
            marginBottom: '15mm',
            marginLeft: '10mm',
            marginRight: '10mm',
            enableLocalFileAccess: true,
        })
        .generate()

    rep.header('Content-Type', 'application/pdf')
    rep.header('Content-Disposition', `attachment; filename="cargos-${new Date().toISOString().split('T')[0]}.pdf"`)
    rep.send(buffer)

}

import { AuthMiddleware, CanMiddleware } from "#src/middlewares/index.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new CanMiddleware('job-titles.browse')
        .on('pre-handler'),
]
