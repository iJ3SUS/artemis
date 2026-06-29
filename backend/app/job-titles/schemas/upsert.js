import Joi from '#plugins/joi.js'

export default Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    parent_id: Joi.objectId().optional().allow(null),
    active: Joi.boolean().default(true),
    dependency: Joi.string().allow('').optional(),
    functions: Joi.array().items(Joi.string()).default([]),
    requirements: Joi.array().items(Joi.string()).default([]),
    risks: Joi.array().items(Joi.string()).default([]),
}).options({ stripUnknown: true })
