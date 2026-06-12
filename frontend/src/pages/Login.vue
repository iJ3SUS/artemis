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

const { form, loading, submit } = useForm({ email: '', password: '' })
const auth_message = ref('')

const handleSubmit = async () => {
    auth_message.value = ''
    const { success, message, response } = await submit({ url: '/auth/login', method: 'POST' })

    if (!success) {
        auth_message.value = message
        return
    }

    await auth.login(response)
    router.push('/')
}
</script>
