<template>
    <Card>
        <template #header>
            Familiares
        </template>
        <template #content>
            <p class="text-sm text-gray-400">No hay familiares registrados</p>
        </template>
    </Card>
</template>

<script setup lang="ts">

defineProps<{
    employee: Record<string, any>
}>()

</script>
