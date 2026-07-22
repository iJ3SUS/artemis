import Joi from '#plugins/joi.js'

export default Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().allow('').optional(),
    active: Joi.boolean().optional(),
    job_title_id: Joi.objectId().optional(),
})
