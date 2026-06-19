<template>
    <aside class="hidden lg:flex flex-col w-64 border-r border-border bg-surface shrink-0">
        <!-- Company Card -->
        <div class="border-b border-border shrink-0">
            <div class="p-4">
                <div class="flex items-center gap-3 p-3 rounded-xl bg-surface-hover border border-border/50">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                        <span class="text-white font-bold text-sm">{{ ui.empresa.charAt(0) }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-semibold text-text truncate">{{ ui.empresa }}</div>
                        <div class="flex items-center gap-1.5 mt-0.5">
                            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            <span class="text-[10px] text-text-muted">Empresa activa</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            <!-- Section: Principal -->
            <div class="mb-4">
                <div class="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Principal</div>
                <router-link v-for="item in mainItems" :key="item.path" :to="item.path" :class="[
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                    isActive(item.path) ? 'bg-primary-600/10 text-primary-400 font-medium' : 'text-text-muted hover:bg-surface-hover hover:text-text'
                ]">
                    <Icon :icon="item.icon" width="18" height="18" class="text-inherit" />
                    <span>{{ item.label }}</span>
                </router-link>
            </div>

            <!-- Section: Gestión -->
            <div class="mb-4">
                <div class="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Gestión</div>
                <router-link v-for="item in managementItems" :key="item.path" :to="item.path" :class="[
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                    isActive(item.path) ? 'bg-primary-600/10 text-primary-400 font-medium' : 'text-text-muted hover:bg-surface-hover hover:text-text'
                ]">
                    <Icon :icon="item.icon" width="18" height="18" class="text-inherit" />
                    <span>{{ item.label }}</span>
                </router-link>
            </div>
        </nav>

        <!-- User Footer -->
        <div class="border-t border-border p-3 shrink-0">
            <div class="flex items-center gap-3 px-2 py-2 rounded-lg bg-surface-hover">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                    <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
                </div>
                <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-text truncate">{{ userName }}</div>
                    <div class="text-xs text-text-muted truncate">{{ userEmail }}</div>
                </div>
                <button @click="handleLogout" class="p-1.5 rounded hover:bg-background transition-colors shrink-0" tooltip="Cerrar sesión" position="top">
                    <Icon icon="Close" width="16" height="16" class="text-text-muted" />
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { routes as menuItems } from '@/router/routes'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const mainItems = computed(() => menuItems.filter(item => item.meta?.protected && item.meta?.section === 'main' && item.meta?.sidebar !== false))
const managementItems = computed(() => menuItems.filter(item => item.meta?.protected && item.meta?.section === 'management' && item.meta?.sidebar !== false))

const isActive = (path: string) => route.path === path

const userName = computed(() => auth.user?.name || 'Usuario')
const userEmail = computed(() => auth.user?.email || 'usuario@email.com')
const userInitials = computed(() => {
    const name = userName.value
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const handleLogout = () => {
    auth.logout()
    router.push('/login')
}
</script>
