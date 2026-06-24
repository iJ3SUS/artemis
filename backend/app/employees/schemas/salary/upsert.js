import Joi from '#plugins/joi.js'

export default Joi.object({
    salary: Joi.number().positive().required(),
    reason: Joi.string().allow('').optional(),
}).options({ stripUnknown: true })
