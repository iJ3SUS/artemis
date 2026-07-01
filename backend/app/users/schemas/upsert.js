import Joi from '#plugins/joi.js'

export default Joi.object({
    names: Joi.string().required(),
    surnames: Joi.string().required(),
    display_name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.object({
        indicative: Joi.string().allow(null, '').optional(),
        number: Joi.string().allow(null, '').optional()
    }).optional().allow(null),
    active: Joi.boolean().default(true),
    identification: Joi.string().allow(null, '').optional(),
    properties: Joi.object().pattern(Joi.string(), Joi.any()).default({}),
    roles: Joi.array().items(Joi.objectId()).default([])
}).options({ stripUnknown: true })
