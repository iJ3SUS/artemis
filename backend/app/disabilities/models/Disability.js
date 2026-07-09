import Model from "lemon-api/plugins/mongodb/model"
import Sequence from "#app/sequences/models/sequence.js"

export default class Disability extends Model {
    static collection = 'disabilities'

    constructor(attributes = {}) {
        super(attributes)
    }

    static async nextNumber() {
        return Sequence.next('disabilities')
    }
}
