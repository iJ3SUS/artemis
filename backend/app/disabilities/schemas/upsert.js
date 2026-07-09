import Joi from '#plugins/joi.js'

export default Joi.object({
    employee_id: Joi.objectId().required(),
    start_date: Joi.timezone().required(),
    end_date: Joi.timezone().required(),
    paid_days: Joi.number().integer().min(0).required(),
    payment_date: Joi.timezone().required(),
    amount: Joi.number().min(0).required(),
    notes: Joi.string().allow('').optional(),
    active: Joi.boolean().default(true),
}).options({ stripUnknown: true })
