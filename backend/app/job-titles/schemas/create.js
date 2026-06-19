import Joi from '#plugins/joi.js'

export default Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    parent_id: Joi.objectId().optional().allow(null),
    level: Joi.number().integer().min(0).required(),
    active: Joi.boolean().default(true),
}).options({ stripUnknown: true })
