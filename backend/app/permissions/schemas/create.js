import Joi from '#src/plugins/joi'

export default Joi.object({
    
    name: Joi.string().min(3).max(50).required(),

    key: Joi.string().min(3).max(50).required(),
    
}).options({ stripUnknown: true })