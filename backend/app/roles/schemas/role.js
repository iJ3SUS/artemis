import Joi from '#plugins/joi.js'

export default Joi.object({
    name: Joi.string()
        .required(),
    description: Joi.string()
        .allow('')
        .optional(),
}).options({ stripUnknown: true })
