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
    { key: 'job-titles.employees.list', name: 'Empleados del cargo',  description: 'Ver empleados pertenecientes a un cargo',         module: 'job-titles' },

    // ── Employees ──
    { key: 'employees.browse',          name: 'Listar empleados',          description: 'Ver listado de empleados',                         module: 'employees' },
    { key: 'employees.show',            name: 'Ver empleado',             description: 'Ver detalle de un empleado',                       module: 'employees' },
    { key: 'employees.create',          name: 'Crear empleado',           description: 'Crear nuevos empleados en el sistema',             module: 'employees' },
    { key: 'employees.update',          name: 'Actualizar empleado',      description: 'Editar datos de un empleado existente',            module: 'employees' },
    { key: 'employees.delete',          name: 'Eliminar empleado',        description: 'Eliminar empleados del sistema',                   module: 'employees' },
    { key: 'employees.list',            name: 'Lista simple empleados',   description: 'Obtener lista liviana de empleados para selectores', module: 'employees' },
    { key: 'employees.salary.update',   name: 'Actualizar salario',       description: 'Actualizar el salario de un empleado',             module: 'employees' },

    // ── Diseases ──
    { key: 'diseases.list',        name: 'Lista simple enfermedades',description: 'Obtener lista liviana de enfermedades para selectores',module: 'diseases' },

    // ── Disabilities ──
    { key: 'disabilities.browse',      name: 'Listar incapacidades',       description: 'Ver listado de incapacidades',                          module: 'disabilities' },
    { key: 'disabilities.show',        name: 'Ver incapacidad',            description: 'Ver detalle de una incapacidad',                       module: 'disabilities' },
    { key: 'disabilities.create',      name: 'Crear incapacidad',          description: 'Crear nuevas incapacidades en el sistema',             module: 'disabilities' },
    { key: 'disabilities.update',      name: 'Actualizar incapacidad',     description: 'Editar datos de una incapacidad existente',             module: 'disabilities' },
    { key: 'disabilities.delete',      name: 'Eliminar incapacidad',       description: 'Eliminar incapacidades del sistema',                    module: 'disabilities' },
    { key: 'disabilities.list',        name: 'Lista simple incapacidades', description: 'Obtener lista liviana de incapacidades para selectores', module: 'disabilities' },

    // ── Charts ──
    { key: 'charts.employees.age-range', name: 'Gráfico edades',         description: 'Ver gráfico de rangos etarios de empleados',        module: 'charts' },
    { key: 'charts.employees.city',      name: 'Gráfico ciudades',       description: 'Ver gráfico de distribución por ciudades',          module: 'charts' },
    { key: 'charts.employees.gender',    name: 'Gráfico género',         description: 'Ver gráfico de distribución por género',            module: 'charts' },
    { key: 'charts.employees.job-title', name: 'Gráfico cargos',         description: 'Ver gráfico de empleados por cargo',                module: 'charts' },
    { key: 'charts.employees.stratum',   name: 'Gráfico estrato',        description: 'Ver gráfico de distribución por estrato',           module: 'charts' },
]

async function seed() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })

    await DB().connectAll()
    const db = DB().connections.get('default').client.db(process.env.MONGODB_NAME)
    const col = db.collection('permissions')

    let created = 0
    let updated = 0

    for (const p of PERMISSIONS) {
        const result = await col.updateOne(
            { key: p.key },
            {
                $set: {
                    name: p.name,
                    description: p.description,
                    module: p.module,
                    updated_at: new Date(),
                },
                $setOnInsert: {
                    created_at: new Date(),
                }
            },
            { upsert: true }
        )

        if (result.upsertedCount > 0) {
            created++
        } else if (result.modifiedCount > 0) {
            updated++
        }
    }

    console.log(`\n  ✓ ${created} creados, ${updated} actualizados, ${PERMISSIONS.length - created - updated} sin cambios\n`)

    await DB().closeAll()
}

seed()
