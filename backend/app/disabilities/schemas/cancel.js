import Joi from '#plugins/joi.js'

export default Joi.object({
    observation: Joi.string().allow('').optional(),
}).options({ stripUnknown: true })
