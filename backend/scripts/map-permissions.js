import 'dotenv/config'
import { DB } from 'lemon-api/plugins/mongodb'

const PERMISSIONS = [
    // ── Users ──
    { key: 'users.browse',      name: 'Listar usuarios',         description: 'Ver listado de usuarios del sistema',                   module: 'users' },
    { key: 'users.show',        name: 'Ver usuario',             description: 'Ver detalle de un usuario',                             module: 'users' },
    { key: 'users.create',      name: 'Crear usuario',           description: 'Crear nuevos usuarios en el sistema',                   module: 'users' },
    { key: 'users.update',      name: 'Actualizar usuario',      description: 'Editar datos de un usuario existente',                  module: 'users' },
    { key: 'users.delete',      name: 'Eliminar usuario',        description: 'Eliminar usuarios del sistema',                         module: 'users' },
    { key: 'users.password',    name: 'Cambiar contraseña',      description: 'Cambiar la contraseña de un usuario',                    module: 'users' },

    // ── Roles ──
    { key: 'roles.browse',      name: 'Listar roles',            description: 'Ver listado de roles del sistema',                       module: 'roles' },
    { key: 'roles.show',        name: 'Ver rol',                 description: 'Ver detalle de un rol',                                  module: 'roles' },
    { key: 'roles.create',      name: 'Crear rol',               description: 'Crear nuevos roles en el sistema',                       module: 'roles' },
    { key: 'roles.update',      name: 'Actualizar rol',          description: 'Editar datos de un rol existente',                       module: 'roles' },
    { key: 'roles.list',        name: 'Lista simple de roles',   description: 'Obtener lista liviana de roles para selectores',         module: 'roles' },

    // ── Job Titles ──
    { key: 'job-titles.browse',      name: 'Listar cargos',            description: 'Ver listado de cargos laborales',                   module: 'job-titles' },
    { key: 'job-titles.show',        name: 'Ver cargo',               description: 'Ver detalle de un cargo laboral',                    module: 'job-titles' },
    { key: 'job-titles.create',      name: 'Crear cargo',             description: 'Crear nuevos cargos laborales',                      module: 'job-titles' },
    { key: 'job-titles.update',      name: 'Actualizar cargo',        description: 'Editar datos de un cargo existente',                 module: 'job-titles' },
    { key: 'job-titles.tree',        name: 'Árbol de cargos',         description: 'Ver organigrama / árbol jerárquico de cargos',       module: 'job-titles' },
    { key: 'job-titles.list',        name: 'Lista simple de cargos',  description: 'Obtener lista liviana de cargos para selectores',    module: 'job-titles' },

    // ── Employees ──
    { key: 'employees.browse',          name: 'Listar empleados',          description: 'Ver listado de empleados',                         module: 'employees' },
    { key: 'employees.show',            name: 'Ver empleado',             description: 'Ver detalle de un empleado',                       module: 'employees' },
    { key: 'employees.create',          name: 'Crear empleado',           description: 'Crear nuevos empleados en el sistema',             module: 'employees' },
    { key: 'employees.update',          name: 'Actualizar empleado',      description: 'Editar datos de un empleado existente',            module: 'employees' },
    { key: 'employees.delete',          name: 'Eliminar empleado',        description: 'Eliminar empleados del sistema',                   module: 'employees' },
    { key: 'employees.list',            name: 'Lista simple empleados',   description: 'Obtener lista liviana de empleados para selectores', module: 'employees' },
    { key: 'employees.salary.update',   name: 'Actualizar salario',       description: 'Actualizar el salario de un empleado',             module: 'employees' },

    // ── Charts ──
    { key: 'charts.employees.age-range', name: 'Gráfico edades',         description: 'Ver gráfico de rangos etarios de empleados',        module: 'charts' },
    { key: 'charts.employees.city',      name: 'Gráfico ciudades',       description: 'Ver gráfico de distribución por ciudades',          module: 'charts' },
    { key: 'charts.employees.gender',    name: 'Gráfico género',         description: 'Ver gráfico de distribución por género',            module: 'charts' },
    { key: 'charts.employees.job-title', name: 'Gráfico cargos',         description: 'Ver gráfico de empleados por cargo',                module: 'charts' },
    { key: 'charts.employees.stratum',   name: 'Gráfico estrato',        description: 'Ver gráfico de distribución por estrato',           module: 'charts' },
]

async function main() {
    const mode = process.argv[2] || 'table'

    if (mode === 'seed') {
        await seed()
    } else if (mode === 'json') {
        printJson()
    } else {
        printTable()
    }
}

function printTable() {
    const header = `${'#'.padEnd(3)} ${'Key'.padEnd(30)} ${'Nombre'.padEnd(25)} ${'Módulo'.padEnd(15)}`
    const sep = '─'.repeat(80)

    console.log(`\n  MAPEO DE PERMISOS — RRHH\n`)
    console.log(sep)
    console.log(header)
    console.log(sep)

    PERMISSIONS.forEach((p, i) => {
        const idx = String(i + 1).padEnd(3)
        const key = p.key.padEnd(30)
        const name = p.name.padEnd(25)
        const mod = p.module.padEnd(15)
        console.log(` ${idx} ${key} ${name} ${mod}`)
    })

    console.log(sep)
    console.log(`\n  Total: ${PERMISSIONS.length} permisos\n`)

    // Group summary
    const groups = {}
    PERMISSIONS.forEach(p => {
        groups[p.module] = (groups[p.module] || 0) + 1
    })
    console.log('  Por módulo:')
    Object.entries(groups).forEach(([mod, count]) => {
        console.log(`    ${mod.padEnd(15)} ${count} permisos`)
    })
    console.log()
}

function printJson() {
    console.log(JSON.stringify(PERMISSIONS, null, 4))
}

async function seed() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()
    const db = DB().connections.get('default').client.db(process.env.MONGODB_NAME)
    const col = db.collection('permissions')

    await col.deleteMany({})

    const docs = PERMISSIONS.map(p => ({
        ...p,
        created_at: new Date(),
        updated_at: new Date(),
    }))

    const result = await col.insertMany(docs)

    console.log(`\n  ✓ ${result.insertedCount} permisos insertados en la colección "permissions"\n`)

    await DB().closeAll()
}

main()
