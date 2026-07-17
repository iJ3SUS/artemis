import Joi from '#plugins/joi.js'

export default Joi.object({
    start_date: Joi.timezone().optional(),
    end_date: Joi.timezone().optional(),
    diseases: Joi.array().items(Joi.object({
        _id: Joi.objectId().required(),
        code: Joi.string().required(),
        description: Joi.string().allow('').optional(),
    })).optional(),
    notes: Joi.string().allow('').optional(),
}).options({ stripUnknown: true })
