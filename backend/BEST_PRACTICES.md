# Best Practices — Backend

## Estructura de Módulos

Cada módulo vive en `app/<modulo>/` y sigue esta estructura:

```
<modulo>/
  models/       # Clases MongoDB (extenden Model de lemon-api)
  routes/       # Handlers de rutas
  schemas/      # Schemas de validación Joi
  services/     # Lógica de negocio (opcional)
  utils/        # Helpers (opcional)
```

Módulos existentes: `auth/`, `channels/`, `chats/`, `contacts/`, `integrations/`, `media/`, `messages/`, `roles/`, `users/`

## Archivos de Ruta

### Naming

Patrón: `<accion>.<metodo_http>.js`

```
login.post.js
me.get.js
list.get.js
browse.get.js
store.post.js
upload.post.js
```

Pueden vivir en subdirectorios: `routes/dashboard/list.get.js`, `routes/channel/text.post.js`

### Tres Exports Obligatorios

```javascript
export const url = '/ruta/aqui'

export const controller = async (req, rep) => {
    // lógica
    return rep.send(data)
}

export const middlewares = [
    new AuthMiddleware(),
]
```

Export opcional para file uploads:
```javascript
export const accepts = ['multipart/form-data']
```

### Orden de Imports

**Regla estricta**: los imports de middlewares van al **final** del archivo (después del controller) para evitar dependencias circulares.

```javascript
// --- ARRIBA: librerías, modelos, servicios ---
import { DateTime } from 'luxon'
import Channel from '#app/channels/models/channel.js'
import Contact from '#app/contacts/models/contact.js'

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

- Sin prefijo `/api` — `PluginRouter` maneja el routing automáticamente
- Rutas autenticadas usan prefijo `/dashboard/`: `/dashboard/channels/list`
- Params en `snake_case`: `:channel_id`, `:contact_id`
- Verbos REST: `list`, `browse`, `store`, `upload`

### Controllers

- Siempre `async (req, rep) => { ... }`
- Destructuring al inicio del controller:
  ```javascript
  const { channel_id } = req.params
  const { to, text } = req.body
  const { user } = req
  ```
- **No** hay try/catch en controllers — el error handling es global (lemon-api)
- Todas las respuestas de error usan `return` para evitar fall-through:
  ```javascript
  return rep.status(400).send({ message: 'File is required' })
  return rep.status(403).send({ message: 'Credenciales no válidas' })
  return rep.status(404).send({ message: 'Channel not found' })
  ```

### Respuestas

**Éxito — datos directos**:
```javascript
return rep.send(channels)
return rep.send(req.user)
```

**Éxito — con metadata**:
```javascript
return rep.send({
    message: 'Message sent successfully',
    resource_id: message._id,
})
```

**Auth token**:
```javascript
return rep.send({
    token_type: 'bearer',
    access_token,
    refresh_token,
    expires_in: 15 * 60,
})
```

### Orden de Middlewares

```javascript
export const middlewares = [
    new AuthMiddleware(),           // 1. Siempre primero
    new ParseOidMiddleware()        // 2. Conversión de params (si aplica)
        .on('channel_id'),
    new ValidateMiddleware()        // 3. Validación de body/query
        .on('pre-handler')
        .schema(SomeSchema)
        .message("Hay errores en el formulario."),
    new PipelineMiddleware()        // 4. Pipeline de agregación (si aplica)
        .match('channel_id', ({ channel_id }) => channel_id || null),
]
```

## Modelos

### Estructura Base

```javascript
import Model from 'lemon-api/plugins/mongodb/model'

export default class ChannelName extends Model {
    static collection = 'collection_name'  // plural, lowercase
    static hidden = []

    constructor(attributes = {}) {
        super(attributes)
    }
}
```

### Convenciones

- **Export**: siempre `export default class`
- **Nombre de clase**: PascalCase singular (`Channel`, `Contact`, `User`)
- **Nombre de archivo**: lowercase singular (`channel.js`, `user.js`)
- **Colección**: plural lowercase (`'channels'`, `'messages'`, `'users'`)
- **`hidden`**: array de campos que se ocultan al serializar (ej: `['password', 'hash']` en User)

### Query API

```javascript
// Pipeline array
const items = await Model.query([{ $sort: { label: 1 } }]).get()
const item = await Model.query([{ $match: { email } }]).first()

// Fluent builder
const items = await Model.query().match({ status: 'active' }).sort({ created_at: -1 }).get()
const item = await Model.query().match({ _id: id }).first()

// Por ID
const item = await Model.find(id)

// Por propiedades
const item = await Model.findBy({ wa_id: '123' })

// Acceso directo a la colección MongoDB
await Model.query().collection.insertMany(records)
```

### Métodos Estáticos Custom

Patrón `upsertBy` para crear o actualizar:
```javascript
static async upsertBy(properties, data) {
    let record = await this.findBy(properties)
    if (record) {
        record.fill(data)
        await record.save()
    } else {
        record = new this({ ...properties, ...data })
        await record.save()
    }
    return record
}
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
- **Siempre** terminar con `.options({ stripUnknown: true })`
- Import de Joi: `import Joi from '#plugins/joi.js'`
- Nombre de archivo: lowercase (`login.js`, `text.js`, `create.js`)
- Variable en rutas: PascalCase + `Schema` (`LoginSchema`, `SendTextSchema`)

### Validador Custom de ObjectId

```javascript
import { ObjectId } from 'lemon-api/plugins/mongodb'

const objectId = Joi.custom((value, helpers) => {
    try {
        return ObjectId.createFromHexString(value)
    } catch (error) {
        return helpers.error('any.invalid')
    }
})
```

## Middlewares

### Convenciones

- Extienden `Middleware` de `lemon-api/plugins/server/middlewares`
- Usan **fluent pattern** — los métodos retornan `this`
- Estado interno con prefijo underscore: `_message`, `_optional`, `_params`
- Implementan `exec()` que retorna un handler async de Fastify

### Re-export desde Barrel

Todos los middlewares se re-exportan desde `middlewares/index.js`:
```javascript
import { Middleware, ValidateMiddleware, FileMiddleware } from 'lemon-api/plugins/server/middlewares'
import AuthMiddleware from './auth.js'
import CanMiddleware from './can.js'
// ...

export { Middleware, ValidateMiddleware, FileMiddleware, AuthMiddleware, CanMiddleware, /* ... */ }
```

## Plugins

### Estilo de Export

| Plugin | Export |
|--------|--------|
| `config.js` | Dual: `export default config` + `export { config }` |
| `server.js` | Named: `export { server }` |
| `io.js` | Named: `export { io }` |
| `joi.js` | Default: `export default Joi` |
| `hash.js` | Default class: `export default class Hash` |
| `session.js` | Default class: `export default class Session` |
| `safe.js` | Named: `export const safe = SafeExecutor` |
| `whatsapp.js` | Named: `export const whatsapp = WhatsAppClient` |

### Config

```javascript
import 'dotenv/config'

const config = {
    db: { host: process.env.MONGODB_URI, name: process.env.MONGODB_NAME },
    server: { port: process.env.SERVER_PORT, host: process.env.SERVER_HOST },
    jwt: { secret: process.env.JWT_SECRET },
    meta: { verify_token, app_secret, system_token },
}

export default config
export { config }
```

## Estilo de Código

### Formato

- **Indentación**: 4 espacios
- **Sin punto y coma** al final de las sentencias
- **Trailing commas** en objetos y arrays multilínea
- **Línea en blanco** entre secciones lógicas (imports, url, controller, middleware imports)
- **Arrow functions** para controllers: `async (req, rep) => { ... }`
- **Sin comentarios** a menos que sea necesario

### Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clases | PascalCase | `Channel`, `AuthMiddleware` |
| Archivos de modelo | lowercase singular | `channel.js` |
| Archivos de ruta | `accion.metodo.js` | `login.post.js` |
| Archivos de middleware | kebab-case | `parse-oid.js` |
| Colecciones | plural lowercase | `'channels'` |
| Variables | snake_case | `access_token`, `channel_id` |
| Params de ruta | snake_case | `:channel_id` |
| Variables de schema en rutas | PascalCase + Schema | `LoginSchema` |

### Exports por Tipo de Archivo

| Tipo | Export |
|------|--------|
| Modelos | `export default class` |
| Schemas | `export default Joi.object(...)` |
| Rutas | `export const url`, `export const controller`, `export const middlewares` |
| Middlewares (individual) | `export default class` |
| Middlewares (barrel) | Named re-exports |
| Servicios | Named function: `export async function` |
| Utils | Named const: `export const ParseMessage = async` |

### Error Handling

- No try/catch en controllers — handler global de lemon-api
- `safe.execute()` para operaciones fire-and-forget
- `Session.verify()` retorna `null` en lugar de lanzar error
- `ParseOidMiddleware` captura errores de ObjectId y retorna 400

### Mensajes de Error

- **Español** para errores de autenticación/validación: `'Credenciales no válidas'`, `'No tienes permisos para realizar esta acción'`
- **Inglés** para mensajes técnicos: `'Channel not found'`, `'File is required'`

### Timezone

Todas las operaciones de fecha usan `America/Bogota`:
```javascript
DateTime.now().setZone('America/Bogota').toJSDate()
DateTime.fromMillis(timestamp * 1000).toJSDate()
```
