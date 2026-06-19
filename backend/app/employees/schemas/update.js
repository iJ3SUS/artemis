import Joi from '#plugins/joi.js'

export default Joi.object({
    names: Joi.string().optional(),
    surnames: Joi.string().optional(),
    identification: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.object({
        indicative: Joi.string().allow('').optional(),
        number: Joi.string().allow('').optional()
    }).optional().allow(null),
    gender: Joi.string().valid('male', 'female', 'other').allow('').optional(),
    job_title_id: Joi.objectId().optional().allow(null),
    entry_date: Joi.date().optional().allow(null),
    retirement_date: Joi.date().optional().allow(null),
    active: Joi.boolean().optional(),
}).options({ stripUnknown: true })
