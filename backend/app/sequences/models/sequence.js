import Model from "lemon-api/plugins/mongodb/model"

export default class Sequence extends Model {

    static collection = 'sequences'

    static async next(name) {

        const collection = this.query().collection

        const result = await collection.findOneAndUpdate(
            { _id: name },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        )

        return result.seq

    }

}
