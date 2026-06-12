---
name: backend-new-module
description: Use ONLY when the user wants to create a new backend module (CRUD, routes, models, schemas, middlewares) in the lemon-api/Fastify project. Triggers on phrases like "create a new module", "add a new resource", "scaffold CRUD", "new endpoint", or naming a new entity like "products", "orders", etc. Do not use for modifying existing modules or for frontend tasks.
---

# Backend New Module Skill

Step-by-step guide to scaffold a new module in the backend following project conventions.

## Step 1: Create Directory Structure

```
backend/app/{module}/
├── models/
│   └── {singular}.js
├── schemas/
│   ├── create.js
│   └── update.js
└── routes/
    ├── list.get.js
    ├── show.get.js
    ├── create.post.js
    ├── update.put.js
    └── delete.delete.js
```

Replace `{module}` with the plural name (e.g., `products`, `orders`) and `{singular}` with the singular name (e.g., `Product`, `Order`).

```bash
mkdir -p backend/app/{module}/{models,schemas,routes}
```

## Step 2: Create the Model

File: `backend/app/{module}/models/{singular}.js`

```javascript
import Model from "lemon-api/plugins/mongodb/model"

export default class {Singular} extends Model {
    static collection = '{module}'

    // Fields to hide from JSON serialization
    static hidden = []

    // Optional: custom static methods
    static async findBySlug(slug) {
        return {Singular}.query([{ $match: { slug } }]).first()
    }

    // Optional: instance methods
    toJSON() {
        const json = super.toJSON()
        // Custom serialization if needed
        return json
    }
}
```

**Notes:**
- `collection` is the MongoDB collection name (plural, lowercase)
- `hidden` array excludes fields from `toJSON()` output (common: `password`, `hash`, `__v`)
- Use `static async` for query helpers, regular methods for instance behavior

## Step 3: Create Validation Schemas

### Create Schema

File: `backend/app/{module}/schemas/create.js`

```javascript
import Joi from '#plugins/joi.js'

export default Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    price: Joi.number().min(0).required(),
    active: Joi.boolean().default(true),
    // Add fields as needed
}).options({ stripUnknown: true })
```

### Update Schema

File: `backend/app/{module}/schemas/update.js`

```javascript
import Joi from '#plugins/joi.js'

export default Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    price: Joi.number().min(0).optional(),
    active: Joi.boolean().optional(),
    // All fields optional for partial updates
}).options({ stripUnknown: true })
```

**Notes:**
- `.options({ stripUnknown: true })` removes fields not defined in schema
- Use `.required()` for mandatory fields, `.optional()` or omit for optional
- Common validators: `Joi.string()`, `Joi.number()`, `Joi.boolean()`, `Joi.array()`, `Joi.object()`
- Email: `Joi.string().email()`, ObjectId: `Joi.string().pattern(/^[0-9a-fA-F]{24}$/)`

## Step 4: Create Routes

### List (GET)

File: `backend/app/{module}/routes/list.get.js`

```javascript
export const url = '/{module}/list'

import {Singular} from "#app/{module}/models/{singular}.js"
import { AuthMiddleware, CanMiddleware, ValidateMiddleware } from "#middlewares/index.js"

export const controller = async (req, rep) => {
    const { page = 1, perPage = 20, search } = req.query

    const pipeline = [
        { $match: { active: true } }
    ]

    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            }
        })
    }

    const total = await {Singular}.query(pipeline).count()
    const items = await {Singular}.query([
        ...pipeline,
        { $skip: (page - 1) * perPage },
        { $limit: parseInt(perPage) },
        { $sort: { createdAt: -1 } }
    ]).get()

    return rep.send({
        data: items,
        pagination: {
            page: parseInt(page),
            perPage: parseInt(perPage),
            total,
            totalPages: Math.ceil(total / perPage)
        }
    })
}

export const middlewares = [
    new AuthMiddleware(),
    new CanMiddleware().permission('{module}.list')
]
```

### Show (GET)

File: `backend/app/{module}/routes/show.get.js`

```javascript
export const url = '/{module}/:id'

import {Singular} from "#app/{module}/models/{singular}.js"
import { AuthMiddleware, CanMiddleware } from "#middlewares/index.js"

export const controller = async (req, rep) => {
    const item = await {Singular}.find(req.params.id)

    if (!item) {
        return rep.status(404).send({ message: 'Recurso no encontrado' })
    }

    return rep.send({ data: item })
}

export const middlewares = [
    new AuthMiddleware(),
    new CanMiddleware().permission('{module}.show')
]
```

### Create (POST)

File: `backend/app/{module}/routes/create.post.js`

```javascript
export const url = '/{module}/create'

import {Singular} from "#app/{module}/models/{singular}.js"
import { AuthMiddleware, CanMiddleware, ValidateMiddleware } from "#middlewares/index.js"
import CreateSchema from "../schemas/create.js"

export const controller = async (req, rep) => {
    const item = await {Singular}.create(req.body)
    return rep.status(201).send({ data: item, message: 'Recurso creado exitosamente' })
}

export const middlewares = [
    new AuthMiddleware(),
    new CanMiddleware().permission('{module}.create'),
    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CreateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
```

### Update (PUT)

File: `backend/app/{module}/routes/update.put.js`

```javascript
export const url = '/{module}/:id'

import {Singular} from "#app/{module}/models/{singular}.js"
import { AuthMiddleware, CanMiddleware, ValidateMiddleware } from "#middlewares/index.js"
import UpdateSchema from "../schemas/update.js"

export const controller = async (req, rep) => {
    const item = await {Singular}.find(req.params.id)

    if (!item) {
        return rep.status(404).send({ message: 'Recurso no encontrado' })
    }

    await item.update(req.body)
    return rep.send({ data: item, message: 'Recurso actualizado exitosamente' })
}

export const middlewares = [
    new AuthMiddleware(),
    new CanMiddleware().permission('{module}.update'),
    new ValidateMiddleware()
        .on('pre-handler')
        .schema(UpdateSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo.")
]
```

### Delete (DELETE)

File: `backend/app/{module}/routes/delete.delete.js`

```javascript
export const url = '/{module}/:id'

import {Singular} from "#app/{module}/models/{singular}.js"
import { AuthMiddleware, CanMiddleware } from "#middlewares/index.js"

export const controller = async (req, rep) => {
    const item = await {Singular}.find(req.params.id)

    if (!item) {
        return rep.status(404).send({ message: 'Recurso no encontrado' })
    }

    // Soft delete (recommended)
    await item.update({ active: false })
    // OR hard delete: await item.delete()

    return rep.send({ message: 'Recurso eliminado exitosamente' })
}

export const middlewares = [
    new AuthMiddleware(),
    new CanMiddleware().permission('{module}.delete')
]
```

## Step 5: Register Permissions (if applicable)

If using the RBAC system, add permissions to the `permissions` collection:

- `{module}.list`
- `{module}.show`
- `{module}.create`
- `{module}.update`
- `{module}.delete`

Then assign these permissions to the appropriate roles.

## Step 6: Test the Module

Start the server and test endpoints:

```bash
pnpm --filter backend dev
```

Example requests:

```bash
# List
curl -H "Authorization: Bearer <token>" http://localhost:5000/{module}/list

# Show
curl -H "Authorization: Bearer <token>" http://localhost:5000/{module}/<id>

# Create
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"name":"Test","price":100}' http://localhost:5000/{module}/create

# Update
curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"price":150}' http://localhost:5000/{module}/<id>

# Delete
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:5000/{module}/<id>
```

## Conventions Checklist

- [ ] Module directory under `backend/app/{module}/`
- [ ] Model extends `Model` from `lemon-api/plugins/mongodb/model`
- [ ] Model has `static collection` defined
- [ ] Schemas use Joi with `.options({ stripUnknown: true })`
- [ ] Route files follow `{action}.{method}.js` naming
- [ ] Routes export `url`, `controller`, and optionally `middlewares`
- [ ] Auth routes use `AuthMiddleware` and `CanMiddleware`
- [ ] Validation uses `ValidateMiddleware` with appropriate schema
- [ ] Error messages in Spanish
- [ ] Uses `#app/`, `#plugins/`, `#middlewares/` path aliases (not relative paths)

## Common Patterns

### Relationships (lookup)

```javascript
const items = await {Singular}.query([
    { $match: { active: true } },
    { $lookup: { from: 'related_collection', localField: 'related_id', foreignField: '_id', as: 'related_data' } },
    { $unwind: { path: '$related_data', preserveNullAndEmptyArrays: true } }
]).get()
```

### Pagination Helper

```javascript
const paginate = async (Model, pipeline, { page = 1, perPage = 20 }) => {
    const total = await Model.query(pipeline).count()
    const data = await Model.query([
        ...pipeline,
        { $skip: (page - 1) * perPage },
        { $limit: parseInt(perPage) },
        { $sort: { createdAt: -1 } }
    ]).get()

    return { data, pagination: { page, perPage, total, totalPages: Math.ceil(total / perPage) } }
}
```

### Soft Delete vs Hard Delete

Prefer soft delete (`active: false`) for data that may need recovery. Use hard delete (`item.delete()`) only for truly disposable data.
