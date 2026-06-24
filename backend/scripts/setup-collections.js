import 'dotenv/config'
import { DB } from 'lemon-api/plugins/mongodb'

const COLLECTIONS = [
    'users',
    'employees',
    'job_titles',
    'roles',
    'permissions',
    'salary_histories',
]

const COLLATION = {
    locale: 'es',
    strength: 1,
    caseLevel: false,
}

async function setup() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()

    const db = DB().connections.get('default').client.db(process.env.MONGODB_NAME)

    for (const name of COLLECTIONS) {
        try {
            await db.dropCollection(name)
        } catch (_) {}

        await db.createCollection(name, {
            collation: COLLATION
        })

        console.log(`Colección "${name}" creada con collation es`)
    }

    await DB().closeAll()
    console.log(`\n${COLLECTIONS.length} colecciones configuradas`)
}

setup()
