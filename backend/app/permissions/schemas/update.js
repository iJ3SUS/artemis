import Joi from '#src/plugins/joi'

export default Joi.object({

    name: Joi.string().min(3).max(100).optional(),

    key: Joi.string().min(3).max(100).optional(),

    description: Joi.string()
        .allow('')
        .max(200)
        .optional(),

    module: Joi.string()
        .min(2)
        .max(50)
        .optional(),

}).options({ stripUnknown: true })