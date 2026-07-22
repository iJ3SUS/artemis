import 'dotenv/config'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'

async function main() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME,
    })

    await DB().connectAll()

    const settingsCol = DB().collection('settings')
    const now = new Date()

    const existingCompany = await settingsCol.findOne({ key: 'company' })

    if (existingCompany) {
        await settingsCol.updateOne(
            { _id: existingCompany._id },
            {
                $set: {
                    name: process.env.COMPANY_NAME || 'Mi Empresa',
                    logo: process.env.COMPANY_LOGO || '',
                    updated_at: now,
                },
            },
        )
        console.log('  Configuración "company" actualizada')
    } else {
        await settingsCol.insertOne({
            _id: new ObjectId(),
            key: 'company',
            name: process.env.COMPANY_NAME || 'Mi Empresa',
            logo: process.env.COMPANY_LOGO || '',
            created_at: now,
            updated_at: now,
        })
        console.log('  Configuración "company" creada')
    }

    console.log(`\n  Empresa: ${process.env.COMPANY_NAME || 'Mi Empresa'}`)
    console.log(`  Logo: ${process.env.COMPANY_LOGO || '(sin logo)'}`)

    await DB().closeAll()
}

main()
