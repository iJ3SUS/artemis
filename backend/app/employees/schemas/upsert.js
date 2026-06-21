import Joi from '#plugins/joi.js'

export default Joi.object({
    names: Joi.string().required(),
    surnames: Joi.string().required(),
    identification: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.object({
        indicative: Joi.string().allow('').optional(),
        number: Joi.string().allow('').optional()
    }).optional().allow(null),
    gender: Joi.string().valid('male', 'female', 'other').allow('').optional(),
    job_title_id: Joi.objectId().optional().allow(null),
    contract_type: Joi.number().valid(1, 2, 3, 4).allow(null).optional(),
    entry_date: Joi.date().optional().allow(null),
    retirement_date: Joi.date().optional().allow(null),
    active: Joi.boolean().default(true),
}).options({ stripUnknown: true })
