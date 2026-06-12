import Joi from '#plugins/joi.js'

export default Joi.object({
    password: Joi.string()
        .min(6)
        .required()
}).options({ stripUnknown: true })
