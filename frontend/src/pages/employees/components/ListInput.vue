<template>
    <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-2">{{ title }}</h4>
        <Text
            v-model="input"
            :placeholder="placeholder"
            @keydown.enter.prevent="add"
        />
        <div v-if="modelValue.length" class="mt-2 space-y-2">
            <div v-for="(item, index) in modelValue" :key="index"
                class="group flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
                <div class="flex-1 min-w-0 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{{ item }}</div>
                <button type="button"
                    class="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                    @click="remove(index)">
                    <Icon icon="Close" width="14" height="14" class="text-inherit" />
                </button>
            </div>
        </div>
        <p v-else class="mt-2 text-sm text-gray-400">{{ emptyText }}</p>
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