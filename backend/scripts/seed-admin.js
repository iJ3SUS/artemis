import 'dotenv/config'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'
import Hash from '#src/plugins/hash.js'

const ADMIN_EMAIL = 'jesus.rueda.04@gmail.com'
const ADMIN_ROLE_NAME = 'IAD'

async function main() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()

    const permissionsCol = DB().collection('permissions')
    const rolesCol = DB().collection('roles')
    const usersCol = DB().collection('users')

    // ── 1. Obtener todos los permisos ──
    const allPermissions = await permissionsCol.find({}).toArray()

    if (allPermissions.length === 0) {
        console.log('  No hay permisos en la BD. Ejecuta primero: node scripts/create-permissions.js seed')
        await DB().closeAll()
        return
    }

    const permissionIds = allPermissions.map(p => p._id)

    const existingRole = await rolesCol.findOne({ name: ADMIN_ROLE_NAME })

    if (existingRole) {
        await rolesCol.updateOne(
            { _id: existingRole._id },
            { $set: { permissions: permissionIds, updated_at: new Date() } }
        )
        console.log(`  Rol "${ADMIN_ROLE_NAME}" actualizado con ${permissionIds.length} permisos`)
    } else {
        await rolesCol.insertOne({
            _id: new ObjectId(),
            name: ADMIN_ROLE_NAME,
            description: 'Rol con acceso total al sistema',
            permissions: permissionIds,
            created_at: new Date(),
            updated_at: new Date()
        })
        console.log(`  Rol "${ADMIN_ROLE_NAME}" creado con ${permissionIds.length} permisos`)
    }

    // ── 3. Obtener el rol (ya existe) ──
    const role = await rolesCol.findOne({ name: ADMIN_ROLE_NAME })

    // ── 4. Crear o actualizar usuario admin ──
    const existingUser = await usersCol.findOne({ email: { $regex: `^${ADMIN_EMAIL}$`, $options: 'i' } })
    const now = new Date()
    const hashedPassword = await Hash.encrypt('Ja101121')

    if (existingUser) {
        await usersCol.updateOne(
            { _id: existingUser._id },
            {
                $set: {
                    roles: [role._id],
                    active: true,
                    updated_at: now
                }
            }
        )
        console.log(`  Usuario "${ADMIN_EMAIL}" actualizado con rol "${ADMIN_ROLE_NAME}"`)
    } else {
        await usersCol.insertOne({
            _id: new ObjectId(),
            names: 'Admin',
            surnames: 'Sistema',
            display_name: 'Admin Sistema',
            email: ADMIN_EMAIL,
            phone: { indicative: '300', number: '0000000' },
            identification: '123456789',
            active: true,
            password: hashedPassword,
            hash: new ObjectId().toHexString(),
            properties: {},
            roles: [role._id],
            created_at: now,
            updated_at: now
        })
        console.log(`  Usuario "${ADMIN_EMAIL}" creado con rol "${ADMIN_ROLE_NAME}"`)
    }

    console.log(`\n  Email: ${ADMIN_EMAIL}`)
    console.log('  Clave: Ja101121')

    await DB().closeAll()
}

main()
