export const url = '/dashboard/settings/:key'

import Setting from '#app/settings/models/setting.js'

export const controller = async (req, rep) => {
    const { key } = req.params

    const setting = await Setting.query()
        .match({ key })
        .first()

    if (!setting) {
        return rep.status(404).send({ message: 'Configuración no encontrada' })
    }

    return rep.send(setting)
}

import { AuthMiddleware, CanMiddleware } from '#src/middlewares/index.js'

export const middlewares = [
    new AuthMiddleware()
        .message('Debes estar autenticado para acceder a este recurso')
]
