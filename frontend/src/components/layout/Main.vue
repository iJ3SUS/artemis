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
