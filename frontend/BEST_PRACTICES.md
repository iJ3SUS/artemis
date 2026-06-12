# Best Practices — Frontend

## Stack

- **Vue 3** con `<script setup lang="ts">` (Composition API exclusivamente)
- **TypeScript** relajado (`strict: false`) — para type hints y soporte IDE, no enforcement estricto
- **Vite** como bundler
- **Vue Router** para routing
- **Pinia** con Setup Store syntax para estado global
- **Tailwind CSS v4** (vía `@tailwindcss/vite`, sin `tailwind.config.js`)
- **Auto-imports** para Vue, Vue Router, stores, composables, entities, utils

## Estructura de Directorios

```
src/
  main.ts                  # Bootstrap de la app
  App.vue                  # Componente raíz
  globals.d.ts             # Augmentación de tipos globales
  vite-env.d.ts            # Tipos de variables de entorno
  assets/
    main.css               # Tailwind + tema (variables CSS)
  components/
    layout/                # Componentes de layout (Main, Sidebar, Aside)
    page/                  # Wrappers de página (AuthWrapper)
  composables/
    useHttp.ts             # Cliente HTTP (axios wrapper)
    useForm.ts             # Estado de formulario + submission
  entities/
    index.ts               # Interfaces TypeScript (Contact, Channel, Message)
  pages/
    Login.vue
    Settings.vue
    whatsapp/
      Index.vue
      components/          # Componentes locales de página
  router/
    index.ts               # Instancia del router + guards
    routes.ts              # Definición de rutas + icons
  stores/
    auth.ts                # Auth store (Pinia)
    ui.ts                  # UI state store
  utils/
    globals.ts             # Utilidades de fecha
```

## Auto-Imports

**NO importar explícitamente** (ya están disponibles globalmente):
- APIs de Vue: `ref`, `computed`, `reactive`, `watch`, `onMounted`, `watchEffect`, etc.
- APIs de Vue Router: `useRoute`, `useRouter`
- Stores: `useAuthStore`, `useUiStore`
- Composables: `useHttp`, `useForm`
- Entities: `Contact`, `Channel`, `Message`
- Utils: `ParseDate`, `FormatDate`, `FormatDateFromMillis`

**SÍ importar explícitamente** (con alias `@/`):
- Componentes de página: `import Login from '@/pages/Login.vue'`
- Componentes de layout: `import Layout from '@/components/layout/Main.vue'`
- Componentes locales/hermanos: `import Channels from './components/Channels.vue'`
- Definiciones del router: `import { routes, icons } from '@/router/routes'`
- Librerías externas: `import { DateTime } from 'luxon'`

## Componentes

### Estructura Universal

```vue
<template>
    <!-- HTML -->
</template>

<script setup lang="ts">
    // TypeScript + Composition API
</script>

<style scoped>
    <!-- Solo cuando es necesario (transiciones, etc.) -->
</style>
```

- `<template>` **siempre** va primero
- `<script setup lang="ts">` — nunca Options API, nunca `<script>` sin setup
- `<style scoped>` solo cuando es estrictamente necesario

### Props

Siempre con TypeScript generics (nunca runtime props):
```typescript
const props = defineProps<{
    channels: Channel[]
    modelValue: string
}>()
```

### Emits

TypeScript generics con labeled tuple elements:
```typescript
const emit = defineEmits<{
    'update:modelValue': [_id: string]
    'change': [_id: string]
}>()
```

Emits simples sin variable:
```html
<button @click="$emit('back')">...</button>
```

### v-model

Con `defineModel`:
```typescript
const query = defineModel<string>({ default: '' })
```

## Stores (Pinia)

### Setup Store Syntax (Obligatoria)

```typescript
export const useAuthStore = defineStore('auth', () => {
    const is_logged_in = ref(false)
    const user = ref(null)

    const login = async (payload) => { /* ... */ }
    const logout = () => { /* ... */ }

    return { is_logged_in, user, login, logout }
})
```

### Convenciones

- **State**: `snake_case` (`is_logged_in`, `menu_open`, no `isLoggedIn`)
- **State**: `ref()` plano, sin generics de TypeScript en los refs
- **Actions**: funciones `async` plain (no métodos de un objeto)
- **Return**: objeto explícito listando todo el state + actions
- **Nombre del store**: `use` + nombre + `Store` (`useAuthStore`, `useUiStore`)

## Composables

### useHttp

```typescript
const http = useHttp()
const { response, success, message } = await http.request({
    method: 'GET',
    url: '/dashboard/channels/list',
})
```

- Cada llamada a `useHttp()` crea un **nuevo `loading` ref** — usar instancias separadas para estados de carga independientes:
  ```typescript
  const http_channel = useHttp()
  const http_contact = useHttp()
  ```
- Retorna: `{ success, status, response, message }`
- **No** lanza excepciones — todo se captura internamente
- Auto-adjunta Bearer token desde localStorage
- Token se lee de `VITE_SESSION_KEY` en localStorage (JSON con `access_token`)

### useForm

```typescript
const { form, loading, errors, submit, reset, fill } = useForm({
    email: '',
    password: '',
})
```

- `form` es `reactive()` — en template: `v-model="form.email"` (no `form.value.email`)
- `errors` es `ref<Record<string, any>>({})` — keyeado por nombre de campo
- **422 handling**: mapea `response.errors[].context.label` -> nombre de campo, `response.errors[].message` -> mensaje
- `submit()` acepta `AxiosRequestConfig` — los datos del form se inyectan como `config.data`
- Deep clone con `JSON.parse(JSON.stringify(...))` — sin lodash, sin structuredClone
- `reset()` restaura valores originales
- `fill(element)` rellena con nuevos datos, fallback a originales para keys faltantes

## Entidades (TypeScript)

```typescript
export interface Contact {
    _id: string
    wa_id: string
    display_name?: string | null
    channel_id: string
    created_at: string
    updated_at: string
}
```

### Convenciones

- Todos los IDs son `_id: string` (MongoDB ObjectIds serializados)
- Timestamps son `string` (ISO), no `Date`
- Campos opcionales: `?:` con union types (`string | null`)
- Objetos anidados: tipos inline o `Record<string, any>`
- Se auto-importan globalmente

## Router

### Definición de Rutas

```typescript
export const routes = [
    { path: '/login', label: 'Login', component: Login },
    { path: '/', label: 'WhatsApp', icon: 'chat', component: WhatsApp, meta: { protected: true } },
]
```

- Array plano de objetos (sin wrapper `defineRoutes`)
- `label` en español
- `meta.protected: true` para rutas que requieren autenticación
- `icon` es key del objeto `icons` (SVG inline como string)

### Icons

```typescript
export const icons = {
    chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ...>...</svg>`,
}
```

SVGs usan: `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`

Se renderizan con `v-html`:
```html
<span v-html="icons.chat"></span>
```

### Guards

```typescript
router.beforeEach(async (to) => {
    const auth = useAuthStore()
    if (!auth.is_logged_in) await auth.check()
    if (to.meta.protected && !auth.is_logged_in) return '/login'
    if (to.path === '/login' && auth.is_logged_in) return '/'
})
```

- Usa return-value pattern (no `next()`)
- Redirects como string path (no objeto)

## CSS / Tema

### Tailwind v4 — Dark Theme Only

Tema definido en `src/assets/main.css` con bloque `@theme`:

```css
@theme {
  --color-background: var(--color-background);
  --color-surface: var(--color-surface);
  --color-primary: var(--color-primary);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  --color-border: var(--color-border);
  /* ... */
}
```

### Clases Semánticas (Obligatorias)

| Propósito | Clase |
|-----------|-------|
| Fondo de página | `bg-background` |
| Fondo de card/panel | `bg-surface` |
| Hover en card | `hover:bg-surface-hover` |
| Acción primaria | `bg-primary` |
| Hover primario | `hover:bg-primary-hover` |
| Primario transparente | `bg-primary/15`, `bg-primary/20` |
| Texto | `text-text` |
| Texto muted | `text-text-muted` |
| Bordes | `border-border` |
| Focus ring | `focus:ring-primary` |

**Nunca** usar colores hex directamente en templates — siempre usar clases semánticas.

### Fuente

Open Sans (Google Fonts), aplicada vía `--font-sans`.

## Patrones de Página

### Estructura Típica

```typescript
const http = useHttp()
const items = ref<Item[]>([])

const loadData = async () => {
    const { response, success } = await http.request({
        method: 'GET',
        url: '/endpoint',
    })
    if (!success) return
    items.value = response as Item[]
}

onMounted(() => loadData())
```

### State para Filtros/Búsqueda

```typescript
const inputs = reactive({
    channel_id: null,
    contact_id: null,
    search: '',
})
```

### Type Casting de Respuestas

```typescript
items.value = response as Item[]
item.value = response as Item
```

Se usa `as Type` en lugar de generics.

### Componentes Locales de Página

Páginas complejas tienen su propio directorio `components/`:
```
pages/whatsapp/
    Index.vue
    components/
        Channels.vue
        Chat.vue
        Contact.vue
```

Se importan con rutas relativas:
```typescript
import Channels from './components/Channels.vue'
```

## Error Handling

### Capa HTTP
- Todos los errores se capturan en `useHttp.request()` y se retornan como `{ success: false, ... }`
- **No** propagan excepciones a los componentes
- Fallback de mensaje: `error.response?.data?.message ?? error.message ?? 'Error desconocido'`

### Capa de Formulario
- 422: errores mapeados a campos por nombre
- Non-422: `message` retornado para mostrar al usuario

### Capa de Componente
- Guard clauses: `if (!success) return`
- **No** hay try/catch en componentes — el composable maneja todo
- Display de errores: `v-if` condicional con clase `text-red-400`

## Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| State del store | `snake_case` | `is_logged_in`, `menu_open` |
| Composables | `camelCase` con prefijo `use` | `useHttp`, `useForm` |
| Componentes | `PascalCase.vue` | `Chat.vue`, `AuthWrapper.vue` |
| Páginas | `PascalCase.vue` | `Login.vue`, `Settings.vue` |
| Interfaces | `PascalCase` | `Contact`, `Channel` |
| Utils | `PascalCase` | `ParseDate`, `FormatDate` |
| Variables locales | `camelCase` | `newMessage`, `currentContact` |
| Event handlers | prefijo `handle` o verbo | `handleLogout`, `handleSubmit` |
| Clases CSS | Tailwind semántico | `bg-surface`, `text-text-muted` |
| Env vars | `VITE_UPPER_SNAKE` | `VITE_API_URL` |
| Route labels | español | `'Configuración'` |

## Formulario de Login (Patrón Completo)

```typescript
const { form, loading, errors, submit } = useForm({
    email: '',
    password: '',
})

const auth_message = ref('')
const auth = useAuthStore()
const router = useRouter()

const handleSubmit = async () => {
    loading.value = true
    const { success, message, response } = await submit({
        url: '/auth/login',
        method: 'POST',
    })
    if (!success) {
        auth_message.value = message
        return
    }
    await auth.login(response)
    loading.value = false
    router.push('/')
}
```

```html
<form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" />
    <span v-if="errors.email" class="text-red-400">{{ errors.email }}</span>
    <input v-model="form.password" type="password" />
    <span v-if="errors.password" class="text-red-400">{{ errors.password }}</span>
    <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
    </button>
</form>
```

## Propiedades Globales

`$ParseDate` registrado como global property, usado directamente en templates:
```html
{{ $ParseDate(message.arrived_at).toFormat('dd/MM/yy hh:mm a') }}
```

Type augmentado en `globals.d.ts`.

## Sesión

- Almacenada en `localStorage` con key de `VITE_SESSION_KEY`
- Formato: JSON con campo `access_token`
- `auth.check()` restaura sesión desde localStorage al cargar la app
- `auth.logout()` limpia estado + localStorage + token del HTTP client
