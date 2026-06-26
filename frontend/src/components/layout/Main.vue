<template>
    <div class="h-screen flex flex-col bg-background">
        <!-- Header Mobile -->
        <AuthWrapper>
            <header class="lg:hidden h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
            <button @click="ui.menu_open = true" class="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <Icon icon="Menu" width="20" height="20" class="text-text" />
            </button>
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span class="text-white font-bold text-xs">{{ ui.empresa.charAt(0) }}</span>
                </div>
                <div class="text-sm font-semibold text-text">{{ ui.empresa }}</div>
            </div>
            <button @click="handleLogout" class="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <Icon icon="Close" width="20" height="20" class="text-text-muted" />
            </button>
        </header>
        </AuthWrapper>

        <div class="flex-1 flex overflow-hidden">
            <AuthWrapper>
                <Sidebar />
                <Aside />
            </AuthWrapper>

            <!-- Main Content -->
            <main class="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                <div class="flex-1 overflow-y-auto">
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import AuthWrapper from '@/components/page/AuthWrapper.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Aside from '@/components/layout/Aside.vue'

const ui = useUiStore()
const router = useRouter()
const auth = useAuthStore()
const appName = import.meta.env.VITE_APP_NAME || 'ARTEMIS'

const handleLogout = () => {
    auth.logout()
    router.push('/login')
}
</script>
