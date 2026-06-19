<template>
    <div class="bg-white border border-gray-200 rounded shadow-xs mb-3">
        <div class="border-b border-gray-200 text-sm font-semibold p-4">
            <slot name="header" ></slot>
        </div>
    
        <div v-if="$slots.content" class="pt-6 p-4">
            <slot name="content"></slot>
        </div>
        <slot v-else></slot>

        <slot name="footer"></slot>
    </div>
</template>
<script setup>

import { ref, computed } from 'vue'

const props = defineProps({
    header: {
        type: Boolean,
        default: false    
    },
    padding: {
        type: String,
        default: 'pt-6 p-4'
    }
})

const visible = ref(true)

const toggle = () => {
    visible.value = !visible.value
}

</script>