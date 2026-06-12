import jwt from 'jsonwebtoken'

import config from '#plugins/config.js'

export default class Session {

    static create(user, expiresIn = '1d') {

        const payload = {
            sub: user._id,
            email: user.email,
            identification: user.identification,
            hash: user.hash,
            iat: Math.floor(Date.now() / 1000)
        }

        const secret = config.jwt.secret

        return jwt.sign(payload, secret, {
            expiresIn
        })

    }

    static verify(token) {

        try {

            const secret = config.jwt.secret

            const verified = jwt.verify(token, secret)

            return verified
            
        } catch (error) {

            return null
            
        }

    }

    



}