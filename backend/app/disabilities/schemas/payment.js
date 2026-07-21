import Joi from '#plugins/joi.js'

export default Joi.object({
    days_paid: Joi.number().integer().min(0).required(),
    amount: Joi.number().min(0).required(),
    paid_at: Joi.timezone().required(),
    observations: Joi.string().allow('').optional(),
}).options({ stripUnknown: true })
