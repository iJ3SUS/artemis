<template>
    <slot v-if="auth.is_logged_in" />
</template>

<script setup lang="ts">
const auth = useAuthStore()
</script>
