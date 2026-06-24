import fs from 'fs'
import { DateTime } from 'luxon'
import { ObjectId } from 'lemon-api/plugins/mongodb'

const raw = JSON.parse(fs.readFileSync('../temp/db.json', 'utf8'))

const cargos = JSON.parse(fs.readFileSync('../temp/cargos.json', 'utf8'))
const cargoToId = {}
cargos.forEach(c => {
    cargoToId[c.name] = c._id
})

function excelToBogotaDate(serial) {
    const epoch = DateTime.fromISO('1899-12-30', { zone: 'America/Bogota' })
    return epoch.plus({ days: serial - 1 }).toJSDate()
}

const contractMap = {
    'INDEFINIDO': 2,
    'FIJO': 1,
    'OBRA O LABOR': 3,
    'PRESTACION DE SERVICIOS': 4,
}

const genderMap = { 'M': 'male', 'F': 'female' }

const employees = raw.map(e => {
    const fullName = e['APELLIDOS Y NOMBRES'].trim()
    const parts = fullName.split(/\s+/)
    const surnames = parts.slice(0, 2).join(' ')
    const names = parts.slice(2).join(' ')

    const birthSerial = e['FECHA DE NACIMIENTO']
    const birthDate = birthSerial ? excelToBogotaDate(birthSerial) : null

    const cityName = (e.MUNICIPIO || '').trim()

    return {
        _id: new ObjectId(),
        names,
        surnames,
        identification: '',
        email: '',
        phone: { indicative: '', number: '' },
        gender: genderMap[e.GENERO] || 'other',
        birth_date: birthDate,
        stratum: e['ESTRATO SERVICIOS PÚBLICOS'] || 1,
        dependents: e['NÚMERO DE PERSONAS ECONÓMICAMENTE A CARGO'] || 0,
        city_name: cityName,
        cargo: e.CARGO,
        job_title_id: cargoToId[e.CARGO] || null,
        contract_type: contractMap[e['TIPO CONTRATO']] || 2,
        entry_date: null,
        retirement_date: null,
        active: true,
    }
})

fs.writeFileSync('../temp/empleados.json', JSON.stringify(employees, null, 2), 'utf8')
console.log(`${employees.length} empleados guardados en temp/empleados.json`)

const sinCargo = employees.filter(e => !e.job_title_id)
if (sinCargo.length) {
    console.log(`\nEmpleados sin cargo mapeado:`)
    sinCargo.forEach(e => console.log(`  - ${e.names} ${e.surnames}: "${e.cargo}"`))
}
