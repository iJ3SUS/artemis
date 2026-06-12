---
name: backend-dev
description: Use when developing backend modules, routes, models, schemas, middlewares, or services. Covers lemon-api framework, Fastify, MongoDB ODM, route conventions (accion.metodo.js), Joi validation, and module structure.
---

# Backend Development

## Estructura de Módulos

Cada módulo vive en `app/<modulo>/`:

```
<modulo>/
  models/       # Clases MongoDB (extenden Model de lemon-api)
  routes/       # Handlers de rutas
  schemas/      # Schemas de validación Joi
  services/     # Lógica de negocio (opcional)
  utils/        # Helpers (opcional)
```

## Archivos de Ruta

### Naming

Patrón: `<accion>.<metodo_http>.js`

```
login.post.js
list.get.js
store.post.js
```

### Tres Exports Obligatorios

```javascript
export const url = '/ruta/aqui'

export const controller = async (req, rep) => {
    return rep.send(data)
}

export const middlewares = [
    new AuthMiddleware(),
]
```

### Orden de Imports

**Regla estricta**: imports de middlewares van al **final** del archivo:

```javascript
// --- ARRIBA: librerías, modelos, servicios ---
import { DateTime } from 'luxon'
import Channel from '#app/channels/models/channel.js'

export const url = '/ruta'

export const controller = async (req, rep) => {
    // ...
}

// --- ABAJO: middlewares y schemas ---
import { AuthMiddleware, ValidateMiddleware } from '#middlewares/index.js'
import SomeSchema from '#app/modulo/schemas/schema.js'

export const middlewares = [
    new AuthMiddleware(),
    new ValidateMiddleware().schema(SomeSchema),
]
```

### URLs

- Sin prefijo `/api`
- Rutas autenticadas: `/dashboard/`
- Params en `snake_case`: `:channel_id`

### Controllers

- Siempre `async (req, rep) => { ... }`
- Destructuring al inicio:
  ```javascript
  const { channel_id } = req.params
  const { to, text } = req.body
  const { user } = req
  ```
- **No** hay try/catch — error handling es global
- Usar `return` para evitar fall-through:
  ```javascript
  return rep.status(400).send({ message: 'Error' })
  ```

## Modelos

### Estructura Base

```javascript
import Model from 'lemon-api/plugins/mongodb/model'

export default class Channel extends Model {
    static collection = 'channels'
    static hidden = []

    constructor(attributes = {}) {
        super(attributes)
    }
}
```

### Convenciones

- **Export**: `export default class`
- **Clase**: PascalCase singular (`Channel`)
- **Archivo**: lowercase singular (`channel.js`)
- **Colección**: plural lowercase (`'channels'`)

### Query API

```javascript
const items = await Model.query([{ $sort: { label: 1 } }]).get()
const item = await Model.query().match({ status: 'active' }).sort({ created_at: -1 }).get()
const item = await Model.find(id)
const item = await Model.findBy({ wa_id: '123' })
```

## Schemas

### Estructura

```javascript
import Joi from '#plugins/joi.js'

export default Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).options({ stripUnknown: true })
```

### Reglas

- **Siempre** default export
- **Siempre** `.options({ stripUnknown: true })`
- Import: `import Joi from '#plugins/joi.js'`
- Archivo: lowercase (`login.js`)
- Variable: PascalCase + `Schema` (`LoginSchema`)

## Middlewares

### Orden

```javascript
export const middlewares = [
    new AuthMiddleware(),           // 1. Siempre primero
    new ParseOidMiddleware()        // 2. Conversión de params
        .on('channel_id'),
    new ValidateMiddleware()        // 3. Validación
        .on('pre-handler')
        .schema(SomeSchema),
]
```

## Estilo de Código

- **Indentación**: 4 espacios
- **Sin punto y coma**
- **Trailing commas** en multilínea
- **Arrow functions** para controllers
- **Sin comentarios**

### Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clases | PascalCase | `Channel` |
| Archivos de modelo | lowercase | `channel.js` |
| Archivos de ruta | `accion.metodo.js` | `login.post.js` |
| Variables | snake_case | `access_token` |
| Colecciones | plural lowercase | `'channels'` |

### Exports por Tipo

| Tipo | Export |
|------|--------|
| Modelos | `export default class` |
| Schemas | `export default Joi.object(...)` |
| Rutas | `export const url`, `controller`, `middlewares` |
| Servicios | `export async function` |

## Error Handling

- No try/catch en controllers
- `safe.execute()` para fire-and-forget
- Mensajes en español para auth/validación
- Mensajes en inglés para técnicos

## Timezone

Siempre `America/Bogota`:
```javascript
DateTime.now().setZone('America/Bogota').toJSDate()
```
