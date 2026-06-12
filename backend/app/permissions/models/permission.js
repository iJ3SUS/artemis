import Model from "lemon-api/plugins/mongodb/model"

export default class Permission extends Model {

    static collection = 'permissions'

    static hidden = [
        
    ]

    constructor(attributes = {}) {

        super(attributes)
        
    }

}