import 'dotenv/config'
import { DateTime } from 'luxon'
import { DB, ObjectId } from 'lemon-api/plugins/mongodb'

const tz = 'America/Bogota'

const iso = (date) => DateTime.fromISO(date, { zone: tz }).toJSDate()

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const randomElement = (arr) => arr[randomInt(0, arr.length - 1)]

const randomBirthDate = () => {
    const y = randomInt(1970, 2005)
    const m = randomInt(1, 12)
    const d = randomInt(1, 28)
    return DateTime.fromObject({ year: y, month: m, day: d }, { zone: tz }).toJSDate()
}

const randomEntryDate = () => {
    const y = randomInt(2019, 2026)
    const m = randomInt(1, 12)
    const d = randomInt(1, 28)
    return DateTime.fromObject({ year: y, month: m, day: d }, { zone: tz }).toJSDate()
}

const cities = {
    bogota:        { country_code: 'Co', country_name: 'Colombia', state_code: '11', state_name: 'Bogotá D.C.', city_code: '11001', city_name: 'Bogotá D.C.' },
    medellin:      { country_code: 'Co', country_name: 'Colombia', state_code: '05', state_name: 'Antioquia', city_code: '05001', city_name: 'Medellín' },
    cali:          { country_code: 'Co', country_name: 'Colombia', state_code: '76', state_name: 'Valle del Cauca', city_code: '76001', city_name: 'Cali' },
    barranquilla:  { country_code: 'Co', country_name: 'Colombia', state_code: '08', state_name: 'Atlántico', city_code: '08001', city_name: 'Barranquilla' },
    cartagena:     { country_code: 'Co', country_name: 'Colombia', state_code: '13', state_name: 'Bolívar', city_code: '13001', city_name: 'Cartagena' },
    bucaramanga:   { country_code: 'Co', country_name: 'Colombia', state_code: '68', state_name: 'Santander', city_code: '68001', city_name: 'Bucaramanga' },
    pereira:       { country_code: 'Co', country_name: 'Colombia', state_code: '66', state_name: 'Risaralda', city_code: '66001', city_name: 'Pereira' },
    manizales:     { country_code: 'Co', country_name: 'Colombia', state_code: '17', state_name: 'Caldas', city_code: '17001', city_name: 'Manizales' },
    cucuta:        { country_code: 'Co', country_name: 'Colombia', state_code: '54', state_name: 'Norte de Santander', city_code: '54001', city_name: 'Cúcuta' },
    santa_marta:   { country_code: 'Co', country_name: 'Colombia', state_code: '47', state_name: 'Magdalena', city_code: '47001', city_name: 'Santa Marta' },
    ibague:        { country_code: 'Co', country_name: 'Colombia', state_code: '73', state_name: 'Tolima', city_code: '73001', city_name: 'Ibagué' },
    villavicencio: { country_code: 'Co', country_name: 'Colombia', state_code: '50', state_name: 'Meta', city_code: '50001', city_name: 'Villavicencio' },
    armenia:       { country_code: 'Co', country_name: 'Colombia', state_code: '63', state_name: 'Quindío', city_code: '63001', city_name: 'Armenia' },
    neiva:         { country_code: 'Co', country_name: 'Colombia', state_code: '41', state_name: 'Huila', city_code: '41001', city_name: 'Neiva' },
    valledupar:    { country_code: 'Co', country_name: 'Colombia', state_code: '20', state_name: 'Cesar', city_code: '20001', city_name: 'Valledupar' },
    monteria:      { country_code: 'Co', country_name: 'Colombia', state_code: '23', state_name: 'Córdoba', city_code: '23001', city_name: 'Montería' },
    pasto:         { country_code: 'Co', country_name: 'Colombia', state_code: '52', state_name: 'Nariño', city_code: '52001', city_name: 'Pasto' },
    popayan:       { country_code: 'Co', country_name: 'Colombia', state_code: '19', state_name: 'Cauca', city_code: '19001', city_name: 'Popayán' },
}

const now = new Date()

const employees = [
    {
        _id: new ObjectId('690000000000000000000101'),
        names: 'Carlos Andrés',
        surnames: 'Rodríguez López',
        identification: '1001234567',
        email: 'carlos.rodriguez@empresa.com',
        phone: { indicative: '311', number: '5551234' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 2,
        city: cities.bogota,
        job_title_id: new ObjectId('690000000000000000000001'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000102'),
        names: 'María Fernanda',
        surnames: 'Gómez Martínez',
        identification: '1002345678',
        email: 'maria.gomez@empresa.com',
        phone: { indicative: '320', number: '5552345' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 1,
        city: cities.medellin,
        job_title_id: new ObjectId('690000000000000000000002'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000103'),
        names: 'Juan David',
        surnames: 'Torres Ramírez',
        identification: '1003456789',
        email: 'juan.torres@empresa.com',
        phone: { indicative: '315', number: '5553456' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.cali,
        job_title_id: new ObjectId('690000000000000000000003'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000104'),
        names: 'Ana Patricia',
        surnames: 'Vargas Castillo',
        identification: '1004567890',
        email: 'ana.vargas@empresa.com',
        phone: { indicative: '310', number: '5554567' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 3,
        city: cities.barranquilla,
        job_title_id: new ObjectId('690000000000000000000004'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000105'),
        names: 'Roberto Carlos',
        surnames: 'Mendoza Silva',
        identification: '1005678901',
        email: 'roberto.mendoza@empresa.com',
        phone: { indicative: '318', number: '5555678' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 2,
        city: cities.cartagena,
        job_title_id: new ObjectId('690000000000000000000005'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000106'),
        names: 'Laura Sofía',
        surnames: 'Herrera Díaz',
        identification: '1006789012',
        email: 'laura.herrera@empresa.com',
        phone: { indicative: '321', number: '5556789' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.bogota,
        job_title_id: new ObjectId('690000000000000000000006'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000107'),
        names: 'Diego Alejandro',
        surnames: 'Ríos Morales',
        identification: '1007890123',
        email: 'diego.rios@empresa.com',
        phone: { indicative: '316', number: '5557890' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.bucaramanga,
        job_title_id: new ObjectId('690000000000000000000007'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000108'),
        names: 'Valentina',
        surnames: 'Castro Peña',
        identification: '1008901234',
        email: 'valentina.castro@empresa.com',
        phone: { indicative: '313', number: '5558901' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 2,
        city: cities.pereira,
        job_title_id: new ObjectId('690000000000000000000008'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000109'),
        names: 'Andrés Felipe',
        surnames: 'Jiménez Ortega',
        identification: '1009012345',
        email: 'andres.jimenez@empresa.com',
        phone: { indicative: '317', number: '5559012' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.manizales,
        job_title_id: new ObjectId('690000000000000000000009'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000010a'),
        names: 'Camila Andrea',
        surnames: 'Reyes Navarro',
        identification: '1010123456',
        email: 'camila.reyes@empresa.com',
        phone: { indicative: '314', number: '5550123' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.cucuta,
        job_title_id: new ObjectId('69000000000000000000000a'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000010b'),
        names: 'Sebastián',
        surnames: 'Flores Guerrero',
        identification: '1011234567',
        email: 'sebastian.flores@empresa.com',
        phone: { indicative: '319', number: '5551235' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 1,
        city: cities.santa_marta,
        job_title_id: new ObjectId('69000000000000000000000b'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000010c'),
        names: 'Isabella',
        surnames: 'Medina Ramos',
        identification: '1012345679',
        email: 'isabella.medina@empresa.com',
        phone: { indicative: '322', number: '5552346' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 3,
        city: cities.ibague,
        job_title_id: new ObjectId('69000000000000000000000c'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000010d'),
        names: 'Mateo',
        surnames: 'Acosta Vega',
        identification: '1013456780',
        email: 'mateo.acosta@empresa.com',
        phone: { indicative: '312', number: '5553457' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.villavicencio,
        job_title_id: new ObjectId('69000000000000000000000d'),
        contract_type: 3,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000010e'),
        names: 'Daniela',
        surnames: 'Paredes Luna',
        identification: '1014567891',
        email: 'daniela.paredes@empresa.com',
        phone: { indicative: '323', number: '5554568' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 2,
        city: cities.armenia,
        job_title_id: new ObjectId('69000000000000000000000e'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000010f'),
        names: 'Nicolás',
        surnames: 'Sandoval Molina',
        identification: '1015678902',
        email: 'nicolas.sandoval@empresa.com',
        phone: { indicative: '311', number: '5555679' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.neiva,
        job_title_id: new ObjectId('69000000000000000000000f'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000110'),
        names: 'Gabriela',
        surnames: 'Cortés Delgado',
        identification: '1016789013',
        email: 'gabriela.cortes@empresa.com',
        phone: { indicative: '320', number: '5556780' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 5,
        dependents: 2,
        city: cities.bogota,
        job_title_id: new ObjectId('690000000000000000000010'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000111'),
        names: 'Santiago',
        surnames: 'Rojas Fuentes',
        identification: '1017890124',
        email: 'santiago.rojas@empresa.com',
        phone: { indicative: '315', number: '5557891' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 0,
        city: cities.valledupar,
        job_title_id: new ObjectId('690000000000000000000011'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000112'),
        names: 'Luciana',
        surnames: 'Pinto Aguilar',
        identification: '1018901235',
        email: 'luciana.pinto@empresa.com',
        phone: { indicative: '318', number: '5558902' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.monteria,
        job_title_id: new ObjectId('690000000000000000000012'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000113'),
        names: 'Tomás',
        surnames: 'Vega Cabrera',
        identification: '1019012346',
        email: 'tomas.vega@empresa.com',
        phone: { indicative: '316', number: '5559013' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 3,
        city: cities.pasto,
        job_title_id: new ObjectId('690000000000000000000013'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000114'),
        names: 'Mariana',
        surnames: 'Ortiz Suárez',
        identification: '1020123457',
        email: 'mariana.ortiz@empresa.com',
        phone: { indicative: '313', number: '5550124' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 2,
        city: cities.popayan,
        job_title_id: new ObjectId('690000000000000000000014'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000115'),
        names: 'Julián',
        surnames: 'Moreno Peña',
        identification: '1021234568',
        email: 'julian.moreno@empresa.com',
        phone: { indicative: '317', number: '5551236' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 1,
        city: cities.medellin,
        job_title_id: new ObjectId('69000000000000000000000e'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000116'),
        names: 'Paula',
        surnames: 'Silva Romero',
        identification: '1022345670',
        email: 'paula.silva@empresa.com',
        phone: { indicative: '314', number: '5552347' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 0,
        city: cities.cali,
        job_title_id: new ObjectId('690000000000000000000007'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000117'),
        names: 'Felipe',
        surnames: 'Guerrero Díaz',
        identification: '1023456781',
        email: 'felipe.guerrero@empresa.com',
        phone: { indicative: '319', number: '5553458' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 4,
        city: cities.barranquilla,
        job_title_id: new ObjectId('690000000000000000000011'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000118'),
        names: 'Carolina',
        surnames: 'Navarro Vargas',
        identification: '1024567892',
        email: 'carolina.navarro@empresa.com',
        phone: { indicative: '322', number: '5554569' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 1,
        city: cities.bucaramanga,
        job_title_id: new ObjectId('690000000000000000000013'),
        contract_type: 4,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000119'),
        names: 'Alejandro',
        surnames: 'Ramos Castro',
        identification: '1025678903',
        email: 'alejandro.ramos@empresa.com',
        phone: { indicative: '312', number: '5555680' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 0,
        city: cities.cartagena,
        job_title_id: new ObjectId('69000000000000000000000f'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000011a'),
        names: 'Andrea',
        surnames: 'Luna Morales',
        identification: '1026789014',
        email: 'andrea.luna@empresa.com',
        phone: { indicative: '323', number: '5556781' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 5,
        dependents: 3,
        city: cities.bogota,
        job_title_id: new ObjectId('69000000000000000000000b'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000011b'),
        names: 'Ricardo',
        surnames: 'Delgado Herrera',
        identification: '1027890125',
        email: 'ricardo.delgado@empresa.com',
        phone: { indicative: '311', number: '5557892' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 4,
        city: cities.pereira,
        job_title_id: new ObjectId('690000000000000000000006'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000011c'),
        names: 'Sara',
        surnames: 'Aguilar Torres',
        identification: '1028901236',
        email: 'sara.aguilar@empresa.com',
        phone: { indicative: '320', number: '5558903' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 0,
        city: cities.manizales,
        job_title_id: new ObjectId('690000000000000000000014'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000011d'),
        names: 'David',
        surnames: 'Molina Salazar',
        identification: '1029012347',
        email: 'david.molina@empresa.com',
        phone: { indicative: '315', number: '5559014' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 1,
        city: cities.cucuta,
        job_title_id: new ObjectId('690000000000000000000008'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000011e'),
        names: 'Elena',
        surnames: 'Cabrera Ríos',
        identification: '1030123458',
        email: 'elena.cabrera@empresa.com',
        phone: { indicative: '318', number: '5550125' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 2,
        city: cities.santa_marta,
        job_title_id: new ObjectId('69000000000000000000000a'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },

    // --- nuevos registros ---

    {
        _id: new ObjectId('69000000000000000000011f'),
        names: 'Gustavo Adolfo',
        surnames: 'Zapata Rincón',
        identification: '1031234569',
        email: 'gustavo.zapata@empresa.com',
        phone: { indicative: '311', number: '5551111' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 3,
        city: cities.bogota,
        job_title_id: new ObjectId('69000000000000000000001a'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000120'),
        names: 'Adriana María',
        surnames: 'Quintero Beltrán',
        identification: '1032345670',
        email: 'adriana.quintero@empresa.com',
        phone: { indicative: '320', number: '5552222' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.medellin,
        job_title_id: new ObjectId('690000000000000000000019'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000121'),
        names: 'Óscar Javier',
        surnames: 'Hernández Lozano',
        identification: '1033456782',
        email: 'oscar.hernandez@empresa.com',
        phone: { indicative: '315', number: '5553333' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 2,
        city: cities.cali,
        job_title_id: new ObjectId('690000000000000000000008'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000122'),
        names: 'Natalia',
        surnames: 'Escobar Rueda',
        identification: '1034567893',
        email: 'natalia.escobar@empresa.com',
        phone: { indicative: '310', number: '5554444' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 0,
        city: cities.barranquilla,
        job_title_id: new ObjectId('690000000000000000000009'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000123'),
        names: 'Cristian Camilo',
        surnames: 'Arias Gutiérrez',
        identification: '1035678904',
        email: 'cristian.arias@empresa.com',
        phone: { indicative: '318', number: '5555555' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 1,
        city: cities.ibague,
        job_title_id: new ObjectId('69000000000000000000000f'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000124'),
        names: 'Juliana',
        surnames: 'Palacios Cárdenas',
        identification: '1036789015',
        email: 'juliana.palacios@empresa.com',
        phone: { indicative: '321', number: '5556666' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.bucaramanga,
        job_title_id: new ObjectId('69000000000000000000001f'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000125'),
        names: 'Fernando José',
        surnames: 'Rincón Duarte',
        identification: '1037890126',
        email: 'fernando.rincon@empresa.com',
        phone: { indicative: '316', number: '5557777' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 3,
        city: cities.cartagena,
        job_title_id: new ObjectId('69000000000000000000000c'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000126'),
        names: 'Diana Carolina',
        surnames: 'Montoya Franco',
        identification: '1038901237',
        email: 'diana.montoya@empresa.com',
        phone: { indicative: '313', number: '5558888' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 2,
        city: cities.santa_marta,
        job_title_id: new ObjectId('69000000000000000000000b'),
        contract_type: 3,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000127'),
        names: 'Javier Alonso',
        surnames: 'Bermúdez León',
        identification: '1039012348',
        email: 'javier.bermudez@empresa.com',
        phone: { indicative: '317', number: '5559999' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 1,
        city: cities.villavicencio,
        job_title_id: new ObjectId('690000000000000000000010'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000128'),
        names: 'Vanessa',
        surnames: 'Cifuentes Orozco',
        identification: '1040123459',
        email: 'vanessa.cifuentes@empresa.com',
        phone: { indicative: '314', number: '5550001' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.pereira,
        job_title_id: new ObjectId('690000000000000000000007'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000129'),
        names: 'Mauricio',
        surnames: 'Trujillo Páez',
        identification: '1041234560',
        email: 'mauricio.trujillo@empresa.com',
        phone: { indicative: '319', number: '5551112' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 4,
        city: cities.manizales,
        job_title_id: new ObjectId('69000000000000000000000d'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000012a'),
        names: 'Lorena',
        surnames: 'Giraldo Amaya',
        identification: '1042345671',
        email: 'lorena.giraldo@empresa.com',
        phone: { indicative: '322', number: '5552223' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 5,
        dependents: 2,
        city: cities.bogota,
        job_title_id: new ObjectId('690000000000000000000015'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000012b'),
        names: 'Héctor Fabio',
        surnames: 'Ospina Galvis',
        identification: '1043456782',
        email: 'hector.ospina@empresa.com',
        phone: { indicative: '312', number: '5553334' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 4,
        dependents: 3,
        city: cities.armenia,
        job_title_id: new ObjectId('690000000000000000000014'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000012c'),
        names: 'Claudia Patricia',
        surnames: 'Sánchez Melo',
        identification: '1044567894',
        email: 'claudia.sanchez@empresa.com',
        phone: { indicative: '323', number: '5554445' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.neiva,
        job_title_id: new ObjectId('690000000000000000000013'),
        contract_type: 4,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000012d'),
        names: 'Esteban',
        surnames: 'Cardona Jaramillo',
        identification: '1045678905',
        email: 'esteban.cardona@empresa.com',
        phone: { indicative: '311', number: '5555556' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 0,
        city: cities.valledupar,
        job_title_id: new ObjectId('690000000000000000000011'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000012e'),
        names: 'Milena',
        surnames: 'Ardila Benítez',
        identification: '1046789016',
        email: 'milena.ardila@empresa.com',
        phone: { indicative: '320', number: '5556667' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 1,
        city: cities.monteria,
        job_title_id: new ObjectId('690000000000000000000017'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('69000000000000000000012f'),
        names: 'Jhon Alexander',
        surnames: 'Buitrago Cáceres',
        identification: '1047890127',
        email: 'jhon.buitrago@empresa.com',
        phone: { indicative: '315', number: '5557778' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.pasto,
        job_title_id: new ObjectId('690000000000000000000016'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000130'),
        names: 'Yolanda',
        surnames: 'Estrada Villamil',
        identification: '1048901238',
        email: 'yolanda.estrada@empresa.com',
        phone: { indicative: '310', number: '5558889' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 2,
        city: cities.bogota,
        job_title_id: new ObjectId('690000000000000000000018'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000131'),
        names: 'Fabián Andrés',
        surnames: 'Castañeda Parra',
        identification: '1049012349',
        email: 'fabian.castaneda@empresa.com',
        phone: { indicative: '318', number: '5559990' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 1,
        city: cities.cali,
        job_title_id: new ObjectId('69000000000000000000001b'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000132'),
        names: 'Tatiana',
        surnames: 'Galindo Londoño',
        identification: '1050123450',
        email: 'tatiana.galindo@empresa.com',
        phone: { indicative: '321', number: '5550002' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.medellin,
        job_title_id: new ObjectId('69000000000000000000001c'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000133'),
        names: 'Brayan Steven',
        surnames: 'Uribe Patiño',
        identification: '1051234561',
        email: 'brayan.uribe@empresa.com',
        phone: { indicative: '316', number: '5551113' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 1,
        dependents: 0,
        city: cities.barranquilla,
        job_title_id: new ObjectId('69000000000000000000001d'),
        contract_type: 1,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000134'),
        names: 'Ángela María',
        surnames: 'Pérez Gaitán',
        identification: '1052345672',
        email: 'angela.perez@empresa.com',
        phone: { indicative: '319', number: '5552224' },
        gender: 'female',
        birth_date: randomBirthDate(),
        stratum: 3,
        dependents: 1,
        city: cities.cartagena,
        job_title_id: new ObjectId('69000000000000000000001e'),
        contract_type: 2,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },
    {
        _id: new ObjectId('690000000000000000000135'),
        names: 'Wilmer Eduardo',
        surnames: 'Mejía Fonseca',
        identification: '1053456783',
        email: 'wilmer.mejia@empresa.com',
        phone: { indicative: '312', number: '5553335' },
        gender: 'male',
        birth_date: randomBirthDate(),
        stratum: 2,
        dependents: 0,
        city: cities.bucaramanga,
        job_title_id: new ObjectId('690000000000000000000020'),
        contract_type: 4,

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    },

]

const city_keys = Object.keys(cities)

const male_names = [
    'Carlos', 'Andrés', 'Felipe', 'Juan', 'David', 'Diego', 'Alejandro', 'Sebastián', 'Mateo', 'Nicolás',
    'Santiago', 'Tomás', 'Julián', 'Ricardo', 'Gustavo', 'Óscar', 'Javier', 'Cristian', 'Fernando', 'Mauricio',
    'Héctor', 'Esteban', 'Jhon', 'Fabián', 'Brayan', 'Wilmer', 'Luis', 'Miguel', 'Camilo', 'Manuel',
    'Pedro', 'Pablo', 'Rafael', 'Gabriel', 'Daniel', 'Samuel', 'Alberto', 'Eduardo', 'Francisco', 'Roberto',
    'Mario', 'Antonio', 'Hugo', 'Iván', 'Leonardo', 'Arturo', 'Víctor', 'Jaime', 'Alfredo', 'César',
    'Sergio', 'Adrián', 'Jorge', 'Germán', 'Federico', 'Marco', 'Edgar', 'Ernesto', 'Rubén', 'Humberto',
]

const female_names = [
    'María', 'Fernanda', 'Ana', 'Patricia', 'Laura', 'Sofía', 'Valentina', 'Camila', 'Isabella', 'Daniela',
    'Gabriela', 'Luciana', 'Mariana', 'Paula', 'Carolina', 'Andrea', 'Sara', 'Elena', 'Juliana', 'Vanessa',
    'Lorena', 'Claudia', 'Milena', 'Yolanda', 'Tatiana', 'Ángela', 'Adriana', 'Natalia', 'Diana', 'Mónica',
    'Catalina', 'Sandra', 'Martha', 'Beatriz', 'Gloria', 'Lucía', 'Carmen', 'Rosa', 'Erika', 'Viviana',
    'Alejandra', 'Rocío', 'Luisa', 'Cecilia', 'Isabel', 'Jimena', 'Paola', 'Karina', 'Jessica', 'Yurany',
]

const surnames = [
    'Rodríguez', 'Gómez', 'Torres', 'Vargas', 'Mendoza', 'Herrera', 'Ríos', 'Castro', 'Jiménez', 'Reyes',
    'Flores', 'Medina', 'Acosta', 'Paredes', 'Sandoval', 'Cortés', 'Rojas', 'Pinto', 'Vega', 'Ortiz',
    'Moreno', 'Silva', 'Guerrero', 'Navarro', 'Ramos', 'Luna', 'Delgado', 'Aguilar', 'Molina', 'Cabrera',
    'López', 'Martínez', 'Ramírez', 'Castillo', 'Díaz', 'Morales', 'Peña', 'Ortega', 'Fuentes', 'Suárez',
    'Romero', 'Salazar', 'Zapata', 'Quintero', 'Hernández', 'Escobar', 'Arias', 'Palacios', 'Rincón', 'Montoya',
    'Bermúdez', 'Cifuentes', 'Trujillo', 'Giraldo', 'Ospina', 'Sánchez', 'Cardona', 'Ardila', 'Buitrago', 'Estrada',
    'Castañeda', 'Galindo', 'Uribe', 'Pérez', 'Mejía', 'León', 'Orozco', 'Páez', 'Amaya', 'Galvis',
    'Melo', 'Jaramillo', 'Benítez', 'Cáceres', 'Villamil', 'Parra', 'Londoño', 'Patiño', 'Gaitán', 'Fonseca',
    'Beltrán', 'Lozano', 'Rueda', 'Gutiérrez', 'Cárdenas', 'Duarte', 'Franco',
]

const indicative_list = ['310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', '322', '323']

const job_title_ids = [
    '690000000000000000000001', '690000000000000000000002', '690000000000000000000003',
    '690000000000000000000004', '690000000000000000000005', '690000000000000000000006',
    '690000000000000000000007', '690000000000000000000008', '690000000000000000000009',
    '69000000000000000000000a', '69000000000000000000000b', '69000000000000000000000c',
    '69000000000000000000000d', '69000000000000000000000e', '69000000000000000000000f',
    '690000000000000000000010', '690000000000000000000011', '690000000000000000000012',
    '690000000000000000000013', '690000000000000000000014', '690000000000000000000015',
    '690000000000000000000016', '690000000000000000000017', '690000000000000000000018',
    '690000000000000000000019', '69000000000000000000001a', '69000000000000000000001b',
    '69000000000000000000001c', '69000000000000000000001d', '69000000000000000000001e',
    '69000000000000000000001f', '690000000000000000000020',
]

const used_ids = new Set()
const used_identifications = new Set()

for (const emp of employees) {
    used_ids.add(emp._id.toHexString())
    used_identifications.add(emp.identification)
}

function generateId(index) {
    const oid = `690000000000000000${index.toString(16).padStart(6, '0')}`
    return new ObjectId(oid)
}

function generateIdentification() {
    let id
    do {
        id = String(randomInt(1000000000, 1999999999))
    } while (used_identifications.has(id))
    used_identifications.add(id)
    return id
}

function generateEmail(name, surname) {
    const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.')
    const s = surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.')
    return `${n}.${s}@empresa.com`
}

const ADDITIONAL = 250
const base_index = 0x136

for (let i = 0; i < ADDITIONAL; i++) {
    const index = base_index + i
    const gender = Math.random() < 0.5 ? 'male' : 'female'
    const name_pool = gender === 'male' ? male_names : female_names

    const first = randomElement(name_pool)
    const second = Math.random() < 0.4 ? randomElement(name_pool.filter(n => n !== first)) : null
    const names_str = second ? `${first} ${second}` : first
    const surname1 = randomElement(surnames)
    const surname2 = randomElement(surnames.filter(s => s !== surname1))
    const surnames_str = `${surname1} ${surname2}`

    employees.push({
        _id: generateId(index),
        names: names_str,
        surnames: surnames_str,
        identification: generateIdentification(),
        email: generateEmail(names_str, surname1),
        phone: { indicative: randomElement(indicative_list), number: '555' + String(randomInt(1000, 9999)) },
        gender,
        birth_date: randomBirthDate(),
        stratum: randomInt(1, 5),
        dependents: randomInt(0, 4),
        city: cities[randomElement(city_keys)],
        job_title_id: new ObjectId(randomElement(job_title_ids)),
        contract_type: randomElement([1, 2, 2, 2, 3, 4]),

        entry_date: randomEntryDate(),
        retirement_date: null,
        active: true,
        created_at: now,
        updated_at: now
    })
}


async function seed() {
    DB().setDefaultConnection('default', {
        uri: process.env.MONGODB_URI,
        database: process.env.MONGODB_NAME
    })
    await DB().connectAll()

    const collection = DB().collection('employees')
    await collection.deleteMany({})
    await collection.insertMany(employees)

    console.log(`${employees.length} empleados insertados`)

    await DB().closeAll()
}

seed()
