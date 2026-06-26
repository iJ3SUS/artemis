<template>
    <Text
        :modelValue="modelValue"
        @update:modelValue="onInput"
        v-bind="$attrs"
    />
</template>

<script setup lang="ts">
const props = defineProps({
    modelValue: { type: String, default: '' },
    debounce: { type: Number, default: 400 }
})

const emit = defineEmits(['update:modelValue', 'handle'])

const timeout = ref(null)

const onInput = (val) => {
    emit('update:modelValue', val)
    if (timeout.value) clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
        emit('handle', val)
    }, props.debounce)
}

onUnmounted(() => {
    if (timeout.value) clearTimeout(timeout.value)
})
</script>
