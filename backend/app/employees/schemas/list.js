import Joi from '#plugins/joi.js'

export default Joi.object({
    job_title_id: Joi.objectId().optional(),
    active: Joi.boolean().optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().allow('').optional(),
})
