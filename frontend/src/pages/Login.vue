<template>
    <div class="min-h-screen w-full relative bg-background flex items-center justify-center p-4 overflow-y-auto overflow-x-hidden">
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute -top-32 -left-32 h-96 w-96 bg-primary-600/20 rounded-full blur-3xl" />
            <div class="absolute -bottom-32 -right-32 h-96 w-96 bg-primary-500/15 rounded-full blur-3xl" />
        </div>

        <div class="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 my-auto">
            <!-- Left panel - Branding -->
            <div class="relative overflow-hidden rounded-t-2xl md:rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white p-6 md:p-8 shadow-2xl flex flex-col justify-center min-w-0">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                <div class="relative">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-bold leading-tight">Panel de Gestión</h2>
                        <p class="mt-1 text-primary-100/80">Administra tu negocio desde un solo lugar.</p>
                    </div>

                    <!-- Company Card -->
                    <div class="mt-5 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                                <span class="text-white font-bold">{{ companyName.charAt(0) }}</span>
                            </div>
                            <div>
                                <div class="text-sm font-semibold text-white">{{ companyName }}</div>
                                <div class="flex items-center gap-1.5 mt-0.5">
                                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-300"></div>
                                    <span class="text-[11px] text-primary-100/60">Empresa activa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 grid grid-cols-2 gap-3">
                        <div class="rounded-xl bg-white/10 backdrop-blur-sm p-3 ring-1 ring-white/20">
                            <div class="text-xs text-primary-100/70">Disponibilidad</div>
                            <div class="mt-1 text-lg font-semibold">24/7</div>
                        </div>
                        <div class="rounded-xl bg-white/10 backdrop-blur-sm p-3 ring-1 ring-white/20">
                            <div class="text-xs text-primary-100/70">Seguridad</div>
                            <div class="mt-1 text-lg font-semibold">100%</div>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-24 -right-24 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            <!-- Right panel - Form -->
            <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 ring-1 ring-gray-200 min-w-0 flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-6">
                    <div class="h-9 w-9 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/30">
                        <Icon icon="Key" width="18" height="18" class="text-white" />
                    </div>
                    <div class="text-lg font-semibold text-gray-900 truncate">Accede a tu cuenta</div>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <Text v-model="form.email" label="Email" name="email" :errors="errors" placeholder="tu@correo.com" />
                    <Text v-model="form.password" label="Contraseña" name="password" :errors="errors" type="password" placeholder="••••••••" />
                    <Button color="primary" :disabled="loading" @handle="handleSubmit" class="w-full">
                        {{ loading ? 'Entrando...' : 'Entrar' }}
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || 'ARTEMIS'
const companyName = import.meta.env.VITE_COMPANY_NAME || 'APOSENTOS'
const router = useRouter()
const auth = useAuthStore()

const { form, loading, errors, submit } = useForm({ email: '', password: '' })

const handleSubmit = async () => {
    const { success, response } = await submit({ url: '/auth/login', method: 'POST' })

    if (!success) return

    await auth.login(response)
    router.push('/')
}
</script>
