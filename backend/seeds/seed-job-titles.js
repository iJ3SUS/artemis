import 'dotenv/config'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'

const jobTitles = [
    { _id: new ObjectId('690000000000000000000001'), name: 'Director General', description: 'Máxima autoridad de la empresa', parent_id: null, level: 0, active: true },
    { _id: new ObjectId('690000000000000000000002'), name: 'Director Financiero', description: 'Responsable del área financiera', parent_id: new ObjectId('690000000000000000000001'), level: 1, active: true },
    { _id: new ObjectId('690000000000000000000003'), name: 'Director de Tecnología', description: 'Responsable del área tecnológica', parent_id: new ObjectId('690000000000000000000001'), level: 1, active: true },
    { _id: new ObjectId('690000000000000000000004'), name: 'Director de Recursos Humanos', description: 'Responsable del área de RRHH', parent_id: new ObjectId('690000000000000000000001'), level: 1, active: true },
    { _id: new ObjectId('690000000000000000000005'), name: 'Director Comercial', description: 'Responsable del área comercial', parent_id: new ObjectId('690000000000000000000001'), level: 1, active: true },
    { _id: new ObjectId('690000000000000000000006'), name: 'Contador Senior', description: 'Contabilidad general', parent_id: new ObjectId('690000000000000000000002'), level: 2, active: true },
    { _id: new ObjectId('690000000000000000000007'), name: 'Analista Financiero', description: 'Análisis financiero y presupuestos', parent_id: new ObjectId('690000000000000000000002'), level: 2, active: true },
    { _id: new ObjectId('690000000000000000000008'), name: 'Líder de Desarrollo', description: 'Lidera el equipo de desarrollo', parent_id: new ObjectId('690000000000000000000003'), level: 2, active: true },
    { _id: new ObjectId('690000000000000000000009'), name: 'Líder de Infraestructura', description: 'Lidera el equipo de infraestructura', parent_id: new ObjectId('690000000000000000000003'), level: 2, active: true },
    { _id: new ObjectId('69000000000000000000000a'), name: 'Coordinador de Nómina', description: 'Gestión de nómina y pagos', parent_id: new ObjectId('690000000000000000000004'), level: 2, active: true },
    { _id: new ObjectId('69000000000000000000000b'), name: 'Coordinador de Reclutamiento', description: 'Procesos de selección', parent_id: new ObjectId('690000000000000000000004'), level: 2, active: true },
    { _id: new ObjectId('69000000000000000000000c'), name: 'Líder de Ventas', description: 'Lidera el equipo de ventas', parent_id: new ObjectId('690000000000000000000005'), level: 2, active: true },
    { _id: new ObjectId('69000000000000000000000d'), name: 'Líder de Marketing', description: 'Estrategias de marketing', parent_id: new ObjectId('690000000000000000000005'), level: 2, active: true },
    { _id: new ObjectId('69000000000000000000000e'), name: 'Desarrollador Senior', description: 'Desarrollo de software', parent_id: new ObjectId('690000000000000000000008'), level: 3, active: true },
    { _id: new ObjectId('69000000000000000000000f'), name: 'Desarrollador Junior', description: 'Desarrollo de software', parent_id: new ObjectId('690000000000000000000008'), level: 3, active: true },
    { _id: new ObjectId('690000000000000000000010'), name: 'Administrador de Sistemas', description: 'Gestión de servidores y redes', parent_id: new ObjectId('690000000000000000000009'), level: 3, active: true },
    { _id: new ObjectId('690000000000000000000011'), name: 'Soporte Técnico', description: 'Soporte a usuarios', parent_id: new ObjectId('690000000000000000000009'), level: 3, active: true },
    { _id: new ObjectId('690000000000000000000012'), name: 'Auxiliar Contable', description: 'Apoyo en contabilidad', parent_id: new ObjectId('690000000000000000000006'), level: 3, active: true },
    { _id: new ObjectId('690000000000000000000013'), name: 'Vendedor', description: 'Ventas directas', parent_id: new ObjectId('69000000000000000000000c'), level: 3, active: true },
    { _id: new ObjectId('690000000000000000000014'), name: 'Diseñador Gráfico', description: 'Diseño visual y branding', parent_id: new ObjectId('69000000000000000000000d'), level: 3, active: true },
]

async function seed() {

    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()

    const collection = DB().collection('job_titles')

    await collection.deleteMany({})
    console.log('Colección job_titles limpiada')

    const now = new Date()
    const records = jobTitles.map(jt => ({
        ...jt,
        created_at: now,
        updated_at: now
    }))

    const result = await collection.insertMany(records)
    console.log(`${result.insertedCount} cargos laborales creados`)

    await DB().closeAll()
}

seed()
