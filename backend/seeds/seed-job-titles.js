import 'dotenv/config'
import fs from 'fs'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'

const cargos = JSON.parse(fs.readFileSync('../temp/cargos.json', 'utf8'))

cargos.forEach(c => {
    c._id = new ObjectId(c._id)
})

const nameSet = new Set(cargos.map(c => c.name))
const missingJefes = []

cargos.forEach(c => {
    if (c.jefe && !nameSet.has(c.jefe)) {
        missingJefes.push(c.jefe)
        nameSet.add(c.jefe)
    }
})

missingJefes.forEach(name => {
    const dependencyMap = {
        'COORDINADOR CASA CLUB Y EVENTOS': 'SEDE SOCIAL',
        'JEFE DE SEGURIDAD': 'SEGURIDAD',
    }
    cargos.push({
        _id: new ObjectId(),
        name,
        dependency: dependencyMap[name] || 'ADMINISTRACION',
        jefe: 'GERENTE',
    })
})

const nameToId = {}
cargos.forEach(c => {
    nameToId[c.name] = c._id
})

async function seed() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()

    const collection = DB().collection('job_titles')
    await collection.deleteMany({})

    const now = new Date()

    const records = cargos.map(c => ({
        _id: c._id,
        name: c.name,
        description: '',
        dependency: c.dependency,
        parent_id: c.jefe ? nameToId[c.jefe] || null : null,
        active: true,
        created_at: now,
        updated_at: now,
    }))

    const result = await collection.insertMany(records)
    console.log(`${result.insertedCount} cargos laborales creados`)

    if (missingJefes.length) {
        console.log(`Cargos inferidos como jefes: ${missingJefes.join(', ')}`)
    }

    await DB().closeAll()
}

seed()
