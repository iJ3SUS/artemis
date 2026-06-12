---
name: auth-system
description: Use when scaffolding authentication in a Vue 3 + Pinia + Tailwind project. Includes login page, auth store, router guards, sidebar with logout, and composables (useHttp, useForm). Triggers on "add auth", "login system", "authentication", "protected routes".
---

# Auth System

Complete authentication system for Vue 3 + Pinia + TypeScript + Tailwind CSS projects.

## Architecture

```
src/
├── pages/
│   └── Login.vue                    # Login page with split-panel design
├── components/
│   ├── page/
│   │   └── AuthWrapper.vue          # Conditional slot renderer
│   └── layout/
│       ├── Main.vue                 # App shell with sidebar
│       ├── Sidebar.vue              # Desktop sidebar + logout
│       └── Aside.vue                # Mobile menu drawer
├── stores/
│   └── auth.ts                      # Pinia auth store
├── composables/
│   ├── useHttp.ts                   # Axios wrapper with token management
│   └── useForm.ts                   # Form state + submit helper
└── router/
    ├── index.ts                     # Router + beforeEach guard
    └── routes.ts                    # Route definitions with meta.protected
```

## Dependencies

```bash
pnpm add axios pinia vue-router
```

Auto-import `vue`, `vue-router`, `pinia`, composables, stores, and components via `unplugin-auto-import`.

## 1. Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=BusinessAPI
VITE_SESSION_KEY=session
```

Type declaration (`src/vite-env.d.ts`):

```ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_SESSION_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 2. useHttp Composable

File: `src/composables/useHttp.ts`

```ts
import axios from 'axios'
import { ref } from 'vue'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

export function useHttp() {
    const loading = ref(false)

    const request = async (config) => {
        loading.value = true
        try {
            const response = await api(config)
            return { success: true, status: response.status, response: response.data, message: response.data?.message ?? null }
        } catch (error) {
            return { success: false, status: error.response?.status ?? 500, response: error.response?.data ?? null, message: error.response?.data?.message ?? error.message ?? 'Error desconocido' }
        } finally {
            loading.value = false
        }
    }

    const setToken = (token) => {
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const clearToken = () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
    }

    return { loading, request, setToken, clearToken }
}
```

**Return shape:**

| Property | Success | Error |
|----------|---------|-------|
| `success` | `true` | `false` |
| `status` | HTTP status | HTTP status or 500 |
| `response` | `response.data` | `error.response.data` or null |
| `message` | `response.data.message` or null | Error message string |

## 3. useForm Composable

File: `src/composables/useForm.ts`

```ts
import { ref, reactive } from "vue"
import type { AxiosRequestConfig } from 'axios'

export const useForm = (item: Record<string, any> = {}) => {
    const { loading, request } = useHttp()
    const original = JSON.parse(JSON.stringify(item))
    const form = reactive(JSON.parse(JSON.stringify(item)))
    const errors = ref<Record<string, any>>({})

    const reset = () => {
        errors.value = {}
        Object.keys(original).forEach(e => {
            form[e] = JSON.parse(JSON.stringify(original[e]))
        })
    }

    const fill = (element: Record<string, any>) => {
        const base = JSON.parse(JSON.stringify(original))
        errors.value = {}
        element = JSON.parse(JSON.stringify(element))
        Object.keys(form).forEach(e => {
            if (element[e] === undefined || element[e] === null) {
                form[e] = JSON.parse(JSON.stringify(base[e]))
                return
            }
            form[e] = JSON.parse(JSON.stringify(element[e]))
        })
    }

    const submit = async (config: AxiosRequestConfig = {}) => {
        errors.value = {}
        config.data = form
        const { response, status, success, message } = await request(config)
        if (status == 422) {
            response.errors.forEach(error => {
                errors.value[error.context.label] = error.message
            })
        }
        return { response, status, success, message }
    }

    return { form, loading, errors, submit, reset, fill }
}

export default useForm
```

## 4. Auth Store

File: `src/stores/auth.ts`

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useHttp } from '@/composables/useHttp'

const SESSION_KEY = import.meta.env.VITE_SESSION_KEY || 'session'

export const useAuthStore = defineStore('auth', () => {
    const { request, setToken, clearToken } = useHttp()

    const is_logged_in = ref(false)
    const user = ref(null)

    const login = async (payload) => {
        const result = await request({
            url: 'auth/me',
            headers: { 'Authorization': 'Bearer ' + payload.access_token }
        })

        if (!result.success) {
            localStorage.removeItem(SESSION_KEY)
            return false
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
        setToken(payload.access_token)
        user.value = result.response
        is_logged_in.value = true
        return true
    }

    const check = async () => {
        let session = localStorage.getItem(SESSION_KEY)
        if (!session) {
            is_logged_in.value = false
            return false
        }
        session = JSON.parse(session)
        return await login(session)
    }

    const logout = () => {
        user.value = null
        is_logged_in.value = false
        localStorage.removeItem(SESSION_KEY)
        clearToken()
    }

    const can = (permission) => {
        return user.value?.permissions?.includes(permission) || false
    }

    const access_token = () => {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY))
        return session?.access_token
    }

    return { is_logged_in, user, check, login, logout, can, access_token }
})
```

## 5. Router Guard

File: `src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!auth.is_logged_in) {
        await auth.check()
    }

    if (to.meta.protected && !auth.is_logged_in) {
        return '/login'
    }

    if (to.path === '/login' && auth.is_logged_in) {
        return '/'
    }
})

export default router
```

## 6. Routes

File: `src/router/routes.ts`

Rutas protegidas usan `meta: { protected: true }`. El sidebar filtra automáticamente por esta propiedad.

```ts
export const routes = [
    { path: '/login', label: 'Login', component: Login },
    { path: '/', label: 'Home', icon: 'home', component: Home, meta: { protected: true } },
    { path: '/settings', label: 'Settings', icon: 'settings', component: Settings, meta: { protected: true } },
]

export const icons = {
    home: `<svg>...</svg>`,
    settings: `<svg>...</svg>`,
    close: `<svg>...</svg>`,
}
```

## 7. AuthWrapper

File: `src/components/page/AuthWrapper.vue`

```vue
<template>
    <slot v-if="auth.is_logged_in" />
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>
```

## 8. Login Page

File: `src/pages/Login.vue`

```vue
<template>
    <div class="min-h-screen w-full relative bg-background flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-24 -left-24 h-80 w-80 bg-primary/25 rounded-full blur-3xl" />
            <div class="absolute -bottom-24 -right-24 h-80 w-80 bg-emerald-500/25 rounded-full blur-3xl" />
        </div>

        <div class="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 my-auto">
            <!-- Left panel - Branding -->
            <div class="relative overflow-hidden rounded-t-2xl md:rounded-2xl bg-gradient-to-br from-primary to-emerald-700 text-white p-8 shadow-xl flex flex-col justify-center min-w-0">
                <div class="flex items-center gap-3 mb-8">
                    <div class="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" class="h-6 w-6 text-white">
                            <circle cx="12" cy="12" r="10" fill="currentColor" />
                            <circle cx="12" cy="12" r="6" fill="white" opacity="0.2" />
                        </svg>
                    </div>
                    <div class="text-xl font-semibold tracking-wide truncate">{{ appName }}</div>
                </div>
                <div class="mb-6">
                    <h2 class="text-3xl md:text-4xl font-bold leading-tight">Panel de Gestión</h2>
                    <p class="mt-3 text-white/80">Administra tu negocio desde un solo lugar.</p>
                </div>
                <div class="mt-8 grid grid-cols-2 gap-4">
                    <div class="rounded-xl bg-white/10 p-4">
                        <div class="text-sm text-white/70">Disponibilidad</div>
                        <div class="mt-1 font-semibold">24/7</div>
                    </div>
                </div>
                <div class="absolute -bottom-24 -right-24 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            <!-- Right panel - Form -->
            <div class="bg-surface rounded-2xl shadow-2xl p-8 ring-1 ring-border min-w-0">
                <div class="flex items-center gap-3 mb-6">
                    <div class="h-9 w-9 rounded-md bg-primary text-white flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" class="h-5 w-5">
                            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="currentColor" />
                        </svg>
                    </div>
                    <div class="text-lg font-semibold text-text truncate">Accede a tu cuenta</div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-text-muted">Email</label>
                        <input type="email" class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary" v-model="form.email" placeholder="tu@correo.com" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-text-muted">Contraseña</label>
                        <input type="password" class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary" v-model="form.password" placeholder="••••••••" />
                    </div>
                    <div v-if="auth_message" class="text-red-400 text-sm break-words">{{ auth_message }}</div>
                    <div class="flex items-center justify-between">
                        <a href="#" class="text-sm text-text-muted hover:text-text">¿Olvidaste tu contraseña?</a>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-60" :disabled="loading">
                        {{ loading ? 'Entrando...' : 'Entrar' }}
                    </button>
                    <div class="mt-4 text-center text-xs text-text-muted">© 2026 {{ appName }}. All rights reserved.</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || 'BusinessAPI'
const router = useRouter()
const auth = useAuthStore()

const { form, loading, errors, submit } = useForm({ email: '', password: '' })
const auth_message = ref('')

const handleSubmit = async () => {
    loading.value = true
    const { success, message, response } = await submit({ url: '/auth/login', method: 'POST' })

    if (!success) {
        auth_message.value = message
        return
    }

    await auth.login(response)
    loading.value = false
    router.push('/')
}
</script>
```

### Scroll fixes reference

| Class | Purpose |
|-------|---------|
| `min-h-screen` | Allows content to grow beyond viewport |
| `overflow-y-auto overflow-x-hidden` | Natural vertical scroll, blocks horizontal |
| `overflow-hidden` on bg wrapper | Prevents blur circles from causing overflow |
| `my-auto` on grid | Centers vertically without `max-h-full` |
| `min-w-0` on panels | Prevents flex/grid children from overflowing horizontally |
| `shrink-0` on icons | Prevents icon squishing on small screens |
| `truncate` on long text | Ellipsis instead of overflow |
| `break-words` on errors | Wraps long error messages |

## 9. Sidebar (Desktop)

File: `src/components/layout/Sidebar.vue`

```vue
<template>
    <aside class="hidden lg:flex flex-col w-[72px] border-r border-border bg-surface shrink-0">
        <div class="flex items-center justify-center h-16 border-b border-border">
            <div class="w-10 h-10 rounded-xl text-text flex items-center justify-center text-sm font-bold">{{ initials }}</div>
        </div>
        <nav class="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
            <router-link v-for="item in visibleItems" :key="item.path" :to="item.path" :class="[
                'w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm transition-all',
                isActive(item.path) ? 'bg-primary/15 text-primary font-medium' : 'text-text-muted hover:bg-background hover:text-text'
            ]">
                <span class="w-5 h-5 shrink-0" v-html="icons[item.icon as keyof typeof icons]"></span>
            </router-link>
        </nav>
        <div class="p-2 border-t border-border">
            <button @click="handleLogout" class="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm text-text-muted hover:bg-background hover:text-text transition-all">
                <span class="w-5 h-5 shrink-0" v-html="icons.close"></span>
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { routes as menuItems, icons as navIcons } from '@/router/routes'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const handleLogout = () => { auth.logout(); router.push('/login') }
const isActive = (path: string) => route.path === path
const icons = { ...navIcons }
const visibleItems = computed(() => menuItems.filter(item => item.meta?.protected))
const initials = computed(() => {
    const name = ui.empresa || 'Mi Empresa'
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})
</script>
```

## 10. Aside (Mobile Menu)

File: `src/components/layout/Aside.vue`

```vue
<template>
    <Teleport to="body">
        <Transition name="aside">
            <div v-if="ui.menu_open" class="fixed inset-0 z-50 lg:hidden">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="ui.menu_open = false"></div>
                <aside class="relative h-full bg-surface border-r border-border flex flex-col">
                    <div class="px-4 h-16 border-b border-border flex items-center bg-background">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div class="w-8 h-8 rounded-lg text-text flex items-center justify-center text-xs font-bold shrink-0">{{ initials }}</div>
                            <p class="text-sm text-text font-medium truncate">{{ ui.empresa }}</p>
                        </div>
                        <button @click="ui.menu_open = false" class="p-1.5 hover:bg-background rounded-lg transition-colors shrink-0">
                            <svg class="w-5 h-5 text-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <nav class="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
                        <button v-for="item in visibleItems" :key="item.path" @click="navigate(item.path)" :class="[
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                            route.path === item.path ? 'bg-primary/15 text-primary font-medium' : 'text-text-muted hover:bg-background hover:text-text'
                        ]">
                            <span class="w-5 h-5 shrink-0" v-html="icons[item.icon as keyof typeof icons]"></span>
                            <span>{{ item.label }}</span>
                        </button>
                    </nav>
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { routes as menuItems, icons } from '@/router/routes'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()

const initials = computed(() => {
    const name = ui.empresa || 'Mi Empresa'
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const visibleItems = computed(() => menuItems.filter(item => item.meta?.protected))
const navigate = (path: string) => { router.push(path); ui.menu_open = false }
</script>

<style scoped>
.aside-enter-active, .aside-leave-active { transition: opacity 0.25s ease; }
.aside-enter-from, .aside-leave-to { opacity: 0; }
.aside-enter-active aside, .aside-leave-active aside { transition: transform 0.25s ease; }
.aside-enter-from aside { transform: translateX(-100%); }
.aside-leave-to aside { transform: translateX(-100%); }
</style>
```

## 11. Main Layout

File: `src/components/layout/Main.vue`

```vue
<template>
    <div class="h-screen flex">
        <AuthWrapper>
            <Sidebar />
            <Aside />
        </AuthWrapper>
        <div class="flex-1 flex flex-col min-w-0">
            <header class="lg:hidden h-10 border-b border-border bg-surface flex items-center px-3 shrink-0">
                <button @click="ui.menu_open = true" class="p-1.5 rounded hover:bg-background transition-colors">
                    <svg class="w-5 h-5 text-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
                </button>
            </header>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const ui = useUiStore()
</script>
```

## 12. Backend Endpoints Expected

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Returns `{ access_token, ... }` |
| `GET` | `/auth/me` | Returns user data with `permissions` array |

### Login response shape

```json
{
    "success": true,
    "response": {
        "access_token": "jwt...",
        "user": { "name": "...", "email": "..." }
    }
}
```

### Me response shape

```json
{
    "success": true,
    "response": {
        "name": "...",
        "email": "...",
        "permissions": ["users.list", "users.create"]
    }
}
```

### Validation error shape (422)

```json
{
    "success": false,
    "status": 422,
    "response": {
        "errors": [
            { "context": { "label": "email" }, "message": "El email es requerido" }
        ]
    }
}
```

## Conventions

- Variables: `snake_case` (`is_logged_in`, `access_token`, `handleLogout`)
- Functions/methods: `camelCase` (`setToken`, `clearToken`, `handleSubmit`)
- Template always comes first in `.vue` files
- `template` → `script setup` → `style` order
- Routes use `meta: { protected: true }` (not `requiresAuth`/`requiresGuest`)
- Router guard returns paths instead of calling `next()`
- Sidebar/Aside filter menu items by `item.meta?.protected`
