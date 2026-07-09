import 'dotenv/config'
import { DB } from 'lemon-api/plugins/mongodb'

const COLLECTIONS = [
    'users',
    'employees',
    'job_titles',
    'roles',
    'permissions',
    'salary_histories',
    'disabilities',
    'diseases',
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

    let created = 0

    for (const name of COLLECTIONS) {
        const exists = await db.listCollections({ name }).hasNext()

        if (exists) {
            console.log(`Colección "${name}" ya existe`)
        } else {
            await db.createCollection(name, {
                collation: COLLATION
            })
            console.log(`Colección "${name}" creada con collation es`)
            created++
        }
    }

    await DB().closeAll()
    console.log(`\n${created} colecciones creadas, ${COLLECTIONS.length - created} ya existían`)
}

setup()
