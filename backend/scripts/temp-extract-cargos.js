import fs from 'fs'
import { ObjectId } from 'lemon-api/plugins/mongodb'

const raw = JSON.parse(fs.readFileSync('../temp/db.json', 'utf8'))

const cargoMap = new Map()

raw.forEach(e => {
    if (!cargoMap.has(e.CARGO)) {
        cargoMap.set(e.CARGO, {
            _id: new ObjectId(),
            name: e.CARGO,
            dependency: e.AREA,
            jefe: e.JEFE && e.JEFE !== e.CARGO ? e.JEFE : null,
        })
    }
})

const cargos = [...cargoMap.values()]

console.log(`Total cargos únicos: ${cargos.length}\n`)
cargos.forEach((c, i) => {
    console.log(`${i + 1}. ${c.name}`)
    console.log(`   _id: ${c._id}`)
    console.log(`   dependency: ${c.dependency}`)
    console.log(`   jefe: ${c.jefe}`)
    console.log()
})

fs.writeFileSync('../temp/cargos.json', JSON.stringify(cargos, null, 2), 'utf8')
console.log(`\nGuardado en temp/cargos.json`)
