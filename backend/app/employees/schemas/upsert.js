import Joi from '#plugins/joi.js'

export default Joi.object({
    names: Joi.string().required(),
    surnames: Joi.string().required(),
    display_name: Joi.string().default((parent) => {
        return `${parent.names} ${parent.surnames}`.trim()
    }),
    identification: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.object({
        indicative: Joi.string().allow('').optional(),
        number: Joi.string().allow('').optional()
    }).optional().allow(null),
    gender: Joi.string().valid('male', 'female', 'other').allow('').optional(),
    birth_date: Joi.timezone().optional().allow(null),
    stratum: Joi.number().valid(1, 2, 3, 4, 5, 6).allow(null).optional(),
    dependents: Joi.number().integer().min(0).optional().allow(null),
    job_title_id: Joi.objectId().optional().allow(null),
    contract_type: Joi.number().valid(1, 2, 3, 4).allow(null).optional(),
    city: Joi.object({
        country_code: Joi.string().optional().allow(''),
        country_name: Joi.string().optional().allow(''),
        state_code: Joi.string().optional().allow(''),
        state_name: Joi.string().optional().allow(''),
        city_code: Joi.string().optional().allow(''),
        city_name: Joi.string().optional().allow('')
    }).default({
        country_code: 'Co',
        country_name: 'Colombia',
        state_code: '00',
        state_name: 'No definido',
        city_code: '00000',
        city_name: 'No definido'
    }).allow(null).optional(),
    entry_date: Joi.timezone().optional().allow(null),
    retirement_date: Joi.timezone().optional().allow(null),
    active: Joi.boolean().default(true),
    transport_type: Joi.string().valid('car', 'motorcycle', 'bicycle', 'public', 'walking', 'other').allow('').optional(),
    eps: Joi.string().allow('').optional(),
    afp: Joi.string().allow('').optional(),
    afc: Joi.string().allow('').optional(),
    shoe_size: Joi.string().allow('').optional(),
    shirt_size: Joi.string().allow('').optional(),
    jacket_size: Joi.string().allow('').optional(),
    pants_size: Joi.string().allow('').optional(),
    blood_type: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').allow('').optional(),
    medications: Joi.array().items(Joi.string()).default([]),
    allergies: Joi.array().items(Joi.string()).default([]),
    illnesses: Joi.array().items(Joi.string()).default([]),
    emergency_contact: Joi.object({
        name: Joi.string().allow('').optional(),
        relationship: Joi.string().allow('').optional(),
        phone: Joi.string().allow('').optional()
    }).optional().allow(null),
}).options({ stripUnknown: true })
