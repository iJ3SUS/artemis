# Login - Implementación Vue 3

Diseño extraído y adaptado a Vue 3 con Composition API y Tailwind CSS.

---

## Componente: `src/components/Login.vue`

```vue
<script setup>
import { ref } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  emit('login', email.value, password.value)
}
</script>

<template>
  <div class="min-h-screen w-full relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
    <!-- Background effects -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-24 -left-24 h-80 w-80 bg-blue-500/25 rounded-full blur-3xl" />
      <div class="absolute -bottom-24 -right-24 h-80 w-80 bg-indigo-500/25 rounded-full blur-3xl" />
    </div>

    <!-- Main grid -->
    <div class="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 my-auto">

      <!-- Left panel - Branding -->
      <div class="relative overflow-hidden rounded-t-2xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 shadow-xl flex flex-col justify-center min-w-0">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-8">
          <div class="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" class="h-6 w-6 text-white">
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <circle cx="12" cy="12" r="6" fill="white" opacity="0.2" />
            </svg>
          </div>
          <div class="text-xl font-semibold tracking-wide truncate">NOMBRE_APP</div>
        </div>

        <!-- Title -->
        <div class="mb-6">
          <h2 class="text-3xl md:text-4xl font-bold leading-tight">Tu App Name</h2>
          <p class="mt-3 text-white/80">Descripción breve del portal.</p>
        </div>

        <!-- Stats -->
        <div class="mt-8 grid grid-cols-2 gap-4">
          <div class="rounded-xl bg-white/10 p-4">
            <div class="text-sm text-white/70">Disponibilidad</div>
            <div class="mt-1 font-semibold">24/7</div>
          </div>
        </div>

        <!-- Decorative blur -->
        <div class="absolute -bottom-24 -right-24 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      <!-- Right panel - Login form -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 ring-1 ring-white/10 min-w-0">
        <!-- Form header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="h-9 w-9 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" class="h-5 w-5">
              <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="currentColor" />
            </svg>
          </div>
          <div class="text-lg font-semibold text-slate-900 truncate">Accede a tu cuenta</div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email field -->
          <div>
            <label class="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
              v-model="email"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <!-- Password field -->
          <div>
            <label class="block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
              v-model="password"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Error message -->
          <div v-if="error" class="text-red-600 text-sm break-words">{{ error }}</div>

          <!-- Forgot password link -->
          <div class="flex items-center justify-between">
            <a href="#" class="text-sm text-slate-600 hover:text-slate-900">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            class="w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>

          <!-- Footer -->
          <div class="mt-4 text-center text-xs text-slate-500">© 2026 TU_EMPRESA. All rights reserved.</div>
        </form>
      </div>
    </div>
  </div>
</template>
```

---

## Uso del componente

```vue
<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'

const isLoading = ref(false)
const error = ref(null)

const handleLogin = async (email, password) => {
  isLoading.value = true
  error.value = null
  try {
    // Tu lógica de autenticación aquí
    console.log('Login:', email, password)
  } catch (e) {
    error.value = 'Error de autenticación'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Login
    :is-loading="isLoading"
    :error="error"
    @login="handleLogin"
  />
</template>
```

---

## Variables a Personalizar

| Variable | Reemplazar Por |
|----------|----------------|
| `NOMBRE_APP` | Tu nombre de aplicación |
| `Tu App Name` | Nombre de tu app |
| `Descripción breve del portal.` | Descripción de tu app |
| `tu@correo.com` | Placeholder deseado |
| `TU_EMPRESA` | Tu empresa |

---

## Correcciones de Scroll

Para evitar desbordamientos horizontales y verticales:

| Clase | Propósito |
|-------|-----------|
| `min-h-screen` (outer) | Permite que el contenido crezca más que el viewport |
| `overflow-y-auto overflow-x-hidden` (outer) | Scroll vertical natural, bloquea horizontal |
| `overflow-hidden` (background wrapper) | Evita que los blur circles causen overflow |
| `my-auto` (grid) | Centra verticalmente sin `max-h-full` que corta contenido |
| `min-w-0` (paneles) | Previene que flex/grid children desborden horizontalmente |
| `shrink-0` (iconos) | Evita que los iconos se aplasten en pantallas pequeñas |
| `truncate` (textos largos) | Corta con ellipsis en lugar de desbordar |
| `break-words` (errores) | Rompe mensajes largos de error |
