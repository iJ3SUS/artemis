import Model from "lemon-api/plugins/mongodb/model"

export default class FamilyMember extends Model {
    static collection = 'family_members'

    constructor(attributes = {}) {
        super(attributes)
    }
}
