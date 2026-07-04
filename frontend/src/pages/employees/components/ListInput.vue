<template>
    <div class="px-4 py-5 space-y-3">
        <div class="flex gap-2 items-start">
            <div class="flex-1">
                <Text
                    v-model="input"
                    :label="title"
                    :placeholder="placeholder"
                    @keydown.enter.prevent="add"
                />
            </div>
            <button
                type="button"
                class="px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shrink-0"
                @click="add"
            >
                Agregar
            </button>
        </div>
        <div v-if="modelValue.length" class="flex flex-wrap gap-2">
            <span
                v-for="(item, index) in modelValue" :key="index"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-full"
            >
                {{ item }}
                <button
                    type="button"
                    class="flex items-center justify-center w-4 h-4 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                    @click="remove(index)"
                >
                    <Icon icon="Close" width="12" height="12" class="text-inherit" />
                </button>
            </span>
        </div>
        <p v-else class="text-sm text-gray-400">{{ emptyText }}</p>
    </div>
</template>

<script setup lang="ts">
const input = ref('')

const props = defineProps<{
    modelValue: string[]
    title: string
    placeholder: string
    emptyText: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string[]]
}>()

const add = () => {
    const value = input.value.trim()
    if (value && !props.modelValue.includes(value)) {
        emit('update:modelValue', [...props.modelValue, value])
        input.value = ''
    }
}

const remove = (index: number) => {
    const copy = [...props.modelValue]
    copy.splice(index, 1)
    emit('update:modelValue', copy)
}
</script>