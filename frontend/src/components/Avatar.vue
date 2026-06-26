<template>
    <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
        <span class="text-sm font-semibold text-primary-600">{{ initials }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    name: { type: String, default: '' }
})

const initials = computed(() => {
    const words = props.name.trim().split(/\s+/)
    if (words.length === 0) return '?'
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
})
</script>
