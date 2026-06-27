<template>
    <Main>
        <router-view v-slot="{ Component }">
            <Transition name="page" mode="out-in">
                <component :is="Component" />
            </Transition>
        </router-view>
    </Main>
</template>

<script setup lang="ts">
import Main from '@/components/layout/Main.vue'
</script>
