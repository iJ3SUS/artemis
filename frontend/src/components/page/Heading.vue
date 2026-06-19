<template>
    <div :class="['mb-6', sticky && 'sticky top-0 z-10 bg-white py-4']">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <slot name="back"></slot>
                <slot name="title"></slot>
            </div>
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    sticky: {
        type: Boolean,
        default: false
    }
})

</script>
