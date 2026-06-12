import Joi from '#plugins/joi.js'

export default Joi.object({
    names: Joi.string().optional(),
    surnames: Joi.string().optional(),
    display_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.object({
        indicative: Joi.string().optional().allow(''),
        number: Joi.string().optional().allow('')
    }).optional(),
    active: Joi.boolean().optional(),
    identification: Joi.string().min(5).max(20).optional(),
    properties: Joi.object().optional().pattern(Joi.string(), Joi.any()),
    roles: Joi.array().items(Joi.string()).optional()
}).options({ stripUnknown: true })
