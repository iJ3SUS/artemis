import Joi from '#plugins/joi.js'

export default Joi.object({
    names: Joi.string().required(),
    surnames: Joi.string().required(),
    relationship: Joi.string().valid('spouse', 'child', 'father', 'mother', 'sibling', 'grandparent', 'other').required(),
    gender: Joi.string().valid('male', 'female', 'other').allow('').optional(),
    birth_date: Joi.timezone().optional().allow(null),
}).options({ stripUnknown: true })
