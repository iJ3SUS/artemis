import Model from "lemon-api/plugins/mongodb/model"

export default class JobTitle extends Model {
    static collection = 'job_titles'

    constructor(attributes = {}) {
        super(attributes)
    }
}
