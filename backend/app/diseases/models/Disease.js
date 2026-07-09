import Model from "lemon-api/plugins/mongodb/model"

export default class Disease extends Model {
    static collection = 'diseases'

    constructor(attributes = {}) {
        super(attributes)
    }
}
