import { Middleware } from "lemon-api/plugins/server/middlewares"
import { ObjectId } from "lemon-api/plugins/mongodb"

export default class ParseOidMiddleware extends Middleware {

    _params = []
    
    constructor() {
        super()
    }

    on(param) {
        this._params.push(param)
        return this
    }

    exec()  {

        return async (req, rep) => {

            if(!this._params.length) {
                return rep.status(400).send({
                    "message": "No params fields to parse"
                })
            }

            for(const field of this._params) {
                const value = req.params[field]
                if(value) {
                    try {
                        req.params[field] = ObjectId.createFromHexString(value)
                    } catch {
                        return rep.status(400).send({
                            message: `Invalid ObjectId in param: ${field}`
                        })
                    }
                }
            }

        }
    }

}
