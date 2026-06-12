import { server } from '#plugins/server.js'
import { config } from '#plugins/config.js'

import { DB } from 'lemon-api/plugins/mongodb'

async function start() {

    DB().setDefaultConnection('default', {
        uri: config.db.host, 
        database: config.db.name
    })

    await DB()
        .connectAll()

    await server.listen({ 
        host: config.server.host, 
        port: config.server.port
    })

    console.log(`Server is running on ${config.server.host}:${config.server.port}`)

}

start()