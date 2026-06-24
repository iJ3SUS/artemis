import Model from "lemon-api/plugins/mongodb/model"

export default class SalaryHistory extends Model {
    static collection = 'salary_histories'

    constructor(attributes = {}) {
        super(attributes)
    }
}
