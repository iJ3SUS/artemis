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
}).defaults(schema =>
    schema.options({
        messages: {
            'any.required': 'Requerido.',
            'any.only': 'Valor no válido.',
            'any.invalid': 'Valor inválido.',
            'string.empty': 'No puede estar vacío.',
            'string.min': 'Mínimo {{#limit}} caracteres.',
            'string.max': 'Máximo {{#limit}} caracteres.',
            'string.email': 'Correo electrónico inválido.',
            'string.alphanum': 'Solo caracteres alfanuméricos.',
            'string.pattern.base': 'Formato inválido.',
            'number.base': 'Debe ser un número.',
            'number.min': 'Mínimo {{#limit}}.',
            'number.max': 'Máximo {{#limit}}.',
            'number.integer': 'Debe ser un número entero.',
            'number.positive': 'Debe ser un número positivo.',
            'date.base': 'Fecha inválida.',
            'date.min': 'Fecha muy temprana.',
            'date.max': 'Fecha muy tardía.',
            'array.base': 'Debe ser un arreglo.',
            'array.min': 'Mínimo {{#limit}} elemento(s).',
            'array.max': 'Máximo {{#limit}} elemento(s).',
            'boolean.base': 'Debe ser un booleano.',
            'object.base': 'Debe ser seleccionado.',
        }
    })
)

export default _joi