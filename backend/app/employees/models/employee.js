import Model from "lemon-api/plugins/mongodb/model"

export default class Employee extends Model {
    static collection = 'employees'

    constructor(attributes = {}) {
        super(attributes)
    }
}
