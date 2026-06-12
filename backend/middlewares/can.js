import { Middleware } from "lemon-api/plugins/server/middlewares"

export default class CanMiddleware extends Middleware {

    _permission = null

    constructor(permission = null) {
        super()
        this._permission = permission
    }

    permission(permission) {
        this._permission = permission
        return this
    }

    exec() {

        return async (req, rep) => {

            if (!req.user) {
                return rep.status(401).send({
                    message: 'Usuario no autenticado'
                })
            }

            if (this._permission && !req.user.can(this._permission)) {
                return rep.status(403).send({
                    message: 'No tienes permisos para realizar esta acción'
                })
            }

        }
    }

}