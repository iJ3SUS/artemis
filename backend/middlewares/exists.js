import { DB, ObjectId } from "lemon-api/plugins/mongodb"

import { Middleware } from "lemon-api/plugins/server/middlewares"

export default class ExistsMiddleware extends Middleware {

    _message = 'Este registro ya existe en nuestra base de datos.'
    _collection = null
    _criteria = null

    _utils = {
        hexString: ObjectId.createFromHexString
    }
    
    constructor() {
        
        super()

    }

    message(_message) {
        this._message = _message
        return this
    }

    collection(_collection) {
        this._collection = _collection
        return this
    }

    criteria(_criteria) {
        this._criteria = _criteria
        return this
    }

    exec()  {

        const utils = this._utils
        const cb = this._criteria

        return async (req, rep) => {

            const collection = DB().collection(this._collection)
            
            const { body, params, query } = req

            const criteria = cb({ body, params, query, utils })

            const exists = await collection.findOne(criteria)

            if(exists){

                return rep.status(409).send({
                    message: this._message
                })

            }

        }
    }

}