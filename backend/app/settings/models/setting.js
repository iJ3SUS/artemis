import Model from 'lemon-api/plugins/mongodb/model'

export default class Setting extends Model {
    static collection = 'settings'

    constructor(attributes = {}) {
        super(attributes)
    }
}
