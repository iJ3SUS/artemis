import 'dotenv/config'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'
import Hash from '#src/plugins/hash.js'

async function seed() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()

    const collection = DB().collection('users')
    await collection.deleteMany({})

    const now = new Date()

    const hashedPassword = await Hash.encrypt('1')

    const user = {
        _id: new ObjectId(),
        names: 'Admin',
        surnames: 'Sistema',
        display_name: 'Admin Sistema',
        email: 'admin@sistema.com',
        phone: {
            indicative: '300',
            number: '0000000'
        },
        identification: '123456789',
        active: true,
        password: hashedPassword,
        hash: new ObjectId().toHexString(),
        properties: {},
        roles: [],
        created_at: now,
        updated_at: now
    }

    await collection.insertOne(user)
    console.log('Usuario de prueba creado')
    console.log('  Email: admin@sistema.com')
    console.log('  Clave: 1')

    await DB().closeAll()
}

seed()
