import { Middleware } from "lemon-api/plugins/server/middlewares"

export default class PipelineMiddleware extends Middleware {
    
    _matches = {}

    match(key, callback) {

        this._matches[key] = callback
        return this
    }

    exec() {

        return async (req, rep) => {

            const pipelines = req.pipelines || []

            for(const key in this._matches) {

                const criteria = {
                    $match: {}
                }

                const value = this._matches[key](req.query)

                if(value) {

                    criteria.$match[key] = value

                    pipelines.push(criteria)

                }

            }

            req.pipelines = pipelines
            
        }

    }
}