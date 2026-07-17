import Joi from '#plugins/joi.js'

export default Joi.object({
    employee: Joi.object({
        _id: Joi.objectId().required(),
        display_name: Joi.string().required(),
    }).required(),
    start_date: Joi.timezone().required(),
    end_date: Joi.timezone().required(),
    diseases: Joi.array().items(Joi.object({
        _id: Joi.objectId().required(),
        code: Joi.string().required(),
        description: Joi.string().allow('').optional(),
    })).optional().default([]),
    notes: Joi.string().allow('').optional(),
}).options({ stripUnknown: true })
