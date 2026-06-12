import Joi from '#plugins/joi.js'

export default Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
        
}).options({ stripUnknown: true })