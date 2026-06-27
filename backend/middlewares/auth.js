import { Middleware } from "lemon-api/plugins/server/middlewares"

import Session from "#plugins/session.js"

import User from "#app/users/models/user.js"
import Role from '#app/roles/models/role.js'
export default class AuthMiddleware extends Middleware {

    _message = 'Acceso no autorizado'
    _optional = false
    
    constructor() {
        super()
    }

    message(_message) {
        this._message = _message
        return this
    }

    optional(_optional = true) {
        this._optional = _optional
        return this
    }

    exec() {

        return async (req, rep) => {

            const authHeader = req.headers.authorization
                
            if (!authHeader || !authHeader.startsWith('Bearer ')) {

                if (this._optional) {
                    req.user = null
                    return
                }

                return rep.status(401).send({
                    message: this._message
                })

            }

            const token = authHeader.substring(7)
            
            const resource = await Session.verify(token)

            if (!resource) {
                return rep.status(401).send({
                    message: this._message
                })
            }

            const user = await User.query()
                .match({ _id: resource.sub })
                .first()

            if (!user) {
                return rep.status(401).send({
                    message: this._message
                })
            }

            if (user.hash !== resource.hash) {
                return rep.status(401).send({
                    message: this._message
                })
            }

            if(user?.active === false) {
                return rep.status(401).send({
                    message: this._message
                })
            }

            const roles = await Role.query([
                {
                    $match: {
                        _id: {
                            $in: user.roles
                        }
                    }
                },
                {
                    $lookup: {
                        from: "permissions",          // colección destino
                        localField: "permissions",    // array de ObjectId en Role
                        foreignField: "_id",          // _id en permissions
                        as: "permissions_data"        // nombre del campo resultante
                    }
                }
            ]).get()

            const permissions = []

            roles.forEach(role => {
                role.permissions_data.forEach(permission => {
                    permissions.push(permission.key)
                })
            })

            user.permissions = permissions
   
            req.user = user

        }
    }

}