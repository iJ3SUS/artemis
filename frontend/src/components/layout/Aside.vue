<template>
    <Teleport to="body">
        <Transition name="aside">
            <div v-if="ui.menu_open" class="fixed inset-0 z-50 lg:hidden">
                <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="ui.menu_open = false"></div>
                <aside class="relative h-full bg-surface border-r border-border flex flex-col">
                </aside>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const ui = useUiStore()
</script>

<style scoped>
.aside-enter-active, .aside-leave-active { transition: opacity 0.25s ease; }
.aside-enter-from, .aside-leave-to { opacity: 0; }
.aside-enter-active aside, .aside-leave-active aside { transition: transform 0.25s ease; }
.aside-enter-from aside { transform: translateX(-100%); }
.aside-leave-to aside { transform: translateX(-100%); }
</style>
