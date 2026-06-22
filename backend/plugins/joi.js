import Joi from 'joi'
import { DateTime } from 'luxon'
import { ObjectId } from 'lemon-api/plugins/mongodb'
import config from '#plugins/config.js'

const objectId = () => Joi.custom((value, helpers) => {
    if (value instanceof ObjectId) return value
    if (typeof value === 'string' && ObjectId.isValid(value)) return ObjectId.createFromHexString(value)
    return helpers.error('any.invalid')
}).messages({
    'any.invalid': 'ID inválido.'
})

const timezone = (opts = {}) => {
    const { format } = typeof opts === 'string' ? { format: opts } : opts

    return Joi.custom((value, helpers) => {
        const dt = format
            ? DateTime.fromFormat(value, format, { zone: config.timezone })
            : DateTime.fromISO(value, { zone: config.timezone })
        if (dt.isValid) return dt.toJSDate()
        return helpers.error('dateTimezone.invalid')
    }).messages({
        'dateTimezone.invalid': `Fecha inválida${format ? ` (formato esperado: ${format})` : ''}.`
    })
}

const _joi = Joi.extend({
    type: 'objectId',
    base: objectId()
}, {
    type: 'timezone',
    base: timezone()
})

export default _joi