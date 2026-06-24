import 'dotenv/config'
import fs from 'fs'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'

const empleados = JSON.parse(fs.readFileSync('../temp/empleados.json', 'utf8'))

empleados.forEach(e => {
    e._id = new ObjectId(e._id)
    e.job_title_id = e.job_title_id ? new ObjectId(e.job_title_id) : null
    e.birth_date = e.birth_date ? new Date(e.birth_date) : null
})

async function seed() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()

    const collection = DB().collection('employees')
    await collection.deleteMany({})

    const now = new Date()

    const records = empleados.map(e => ({
        _id: e._id,
        names: e.names,
        surnames: e.surnames,
        identification: e.identification,
        email: e.email,
        phone: e.phone,
        gender: e.gender,
        birth_date: e.birth_date,
        stratum: e.stratum,
        dependents: e.dependents,
        job_title_id: e.job_title_id,
        contract_type: e.contract_type,
        entry_date: e.entry_date,
        retirement_date: e.retirement_date,
        active: e.active,
        created_at: now,
        updated_at: now,
    }))

    await collection.insertMany(records)
    console.log(`${records.length} empleados insertados`)

    await DB().closeAll()
}

seed()
