import Joi from 'joi'
import { ObjectId } from 'lemon-api/plugins/mongodb'

const objectId = () => Joi.custom((value, helpers) => {
    if (value instanceof ObjectId) return value
    if (typeof value === 'string' && ObjectId.isValid(value)) return ObjectId.createFromHexString(value)
    return helpers.error('any.invalid')
}).messages({
    'any.invalid': 'ID inválido.'
})

const _joi = Joi.extend({
    type: 'objectId',
    base: objectId()
})

export default _joi