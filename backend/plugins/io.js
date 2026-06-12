import { server } from '#plugins/server.js'

import { Server as ServerIO } from 'socket.io'

const io = new ServerIO(server.server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id)
})

export { io }


