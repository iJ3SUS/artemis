import { ObjectId } from 'lemon-api/plugins/mongodb'

import Joi from '#plugins/joi.js'

export default Joi.object({

    names: Joi.string()
        .required(),

    surnames: Joi.string()
        .required(),

    display_name: Joi.string().required(),

    email: Joi.string()
        .email()
        .required(),

    phone: Joi.object({
        indicative: Joi.string().required(),
        number: Joi.string().required()
    }).required(),

    active: Joi.boolean()
        .default(true),

    identification: Joi.string()
        .min(5)
        .max(20)
        .required(),

    properties: Joi.object()
        .required()
        .pattern(Joi.string(), Joi.any()),

    roles: Joi.array()
        .items(Joi.custom((value, helpers) => {
            try {
                return ObjectId.createFromHexString(value)
            } catch (error) {
                return helpers.error('any.invalid')
            }
        }))
        .required(),
}).options({ stripUnknown: true })