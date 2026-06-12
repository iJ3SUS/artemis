---
name: frontend-dev
description: Use when developing Vue 3 components, pages, stores, composables, or any frontend code. Covers Vue 3 Composition API, TypeScript, Pinia stores, Tailwind v4 dark theme, auto-imports, useHttp, useForm, router patterns, and naming conventions.
---

# Frontend Development

## Stack

- **Vue 3** con `<script setup lang="ts">` (Composition API exclusivamente)
- **TypeScript** relajado (`strict: false`)
- **Vite** como bundler
- **Vue Router** para routing
- **Pinia** con Setup Store syntax
- **Tailwind CSS v4** (vía `@tailwindcss/vite`, sin `tailwind.config.js`)
- **Auto-imports** para Vue, Vue Router, stores, composables, entities, utils

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

### Estructura

```vue
<template>
    <!-- HTML -->
</template>

<script setup lang="ts">
    // TypeScript + Composition API
</script>

<style scoped>
    <!-- Solo cuando es necesario -->
</style>
```

### Props

Siempre con TypeScript generics:
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

- **State**: `snake_case` (`is_logged_in`, `menu_open`)
- **State**: `ref()` plano, sin generics
- **Actions**: funciones `async` plain
- **Return**: objeto explícito
- **Nombre**: `use` + nombre + `Store`

## Composables

### useHttp

```typescript
const http = useHttp()
const { response, success, message } = await http.request({
    method: 'GET',
    url: '/dashboard/channels/list',
})
```

- Cada llamada crea un **nuevo `loading` ref**
- Retorna: `{ success, status, response, message }`
- **No** lanza excepciones
- Auto-adjunta Bearer token

### useForm

```typescript
const { form, loading, errors, submit, reset, fill } = useForm({
    email: '',
    password: '',
})
```

- `form` es `reactive()` — en template: `v-model="form.email"`
- `errors` es `ref<Record<string, any>>({})`
- **422 handling**: mapea errores a campos
- `submit()` acepta `AxiosRequestConfig`

## CSS / Tema

### Tailwind v4 — Dark Theme Only

### Clases Semánticas (Obligatorias)

| Propósito | Clase |
|-----------|-------|
| Fondo de página | `bg-background` |
| Fondo de card/panel | `bg-surface` |
| Hover en card | `hover:bg-surface-hover` |
| Acción primaria | `bg-primary` |
| Hover primario | `hover:bg-primary-hover` |
| Texto | `text-text` |
| Texto muted | `text-text-muted` |
| Bordes | `border-border` |

**Nunca** usar colores hex directamente — siempre clases semánticas.

## Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| State del store | `snake_case` | `is_logged_in` |
| Composables | `camelCase` con prefijo `use` | `useHttp` |
| Componentes | `PascalCase.vue` | `Chat.vue` |
| Interfaces | `PascalCase` | `Contact` |
| Variables locales | `camelCase` | `newMessage` |
| Clases CSS | Tailwind semántico | `bg-surface` |

## Error Handling

- Guard clauses: `if (!success) return`
- **No** hay try/catch en componentes
- Display de errores: `v-if` condicional con `text-red-400`
