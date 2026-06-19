<template>
    <div :class="[
        'mb-8',
        sticky && 'sticky top-0 z-10 -mx-6 px-6 py-4 bg-white border-b border-gray-200 shadow-xs'
    ]">
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <slot name="back"></slot>
                <div>
                    <slot name="title"></slot>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <slot name="actions"></slot>
            </div>
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
