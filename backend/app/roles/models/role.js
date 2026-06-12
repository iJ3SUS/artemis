import Model from "lemon-api/plugins/mongodb/model"

export default class Role extends Model {

    static collection = 'roles'

    static hidden = [
        
    ]

    constructor(attributes = {}) {

        super(attributes)
        
    }

}