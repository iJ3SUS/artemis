export const url = '/auth/login'

import Session from "#plugins/session.js"
import Hash from "#src/plugins/hash.js"

import User from "#app/users/models/user.js"

export const controller = async (req, rep) => {

    const { email, password } = req.body   

    const user = await User.query([
        {
            $match: {
                email: {
                    $regex: new RegExp(`^${email}$`, 'i')
                },
                active: true
            }
        }
    ]).first()

    if (!user) {
        return rep.status(403).send({
            message: 'Credenciales no válidas'
        })
    }

    const is_valid = await Hash.compare(password, user.password)

    if (!is_valid) {
        return rep.status(403).send({
            message: 'Credenciales no válidas'
        })   
    }

    const access_token = Session.create(user, '1d')
    const refresh_token = Session.create(user, '7d')

    return rep.send({
        token_type: 'bearer',
        access_token,
        refresh_token,
        expires_in: 15 * 60,
    })

}

import { ValidateMiddleware } from "#src/middlewares/index.js"
import LoginSchema from "../schemas/login.js"

export const middlewares = [

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(LoginSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
        
]
