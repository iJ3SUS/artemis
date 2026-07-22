<template>
    <div class="relative w-full">
        <Text
            :modelValue="search"
            @update:modelValue="onInput"
            v-bind="$attrs"
            :disabled="disabled"
            @focus="onFocus"
            @blur="onBlur"
        />
        <Transition name="fade">
            <div v-if="visible && result.length && !disabled" class="mt-0.5 absolute bg-white w-full max-h-48 overflow-y-auto shadow-lg rounded-b-md z-50" @mouseleave="onDropdownLeave">
                <slot name="items" :result="result" />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
const SESSION_KEY = import.meta.env.VITE_SESSION_KEY || 'session'

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    route: { type: String, default: '' },
    transform: { type: Function, default: null },
    disabled: { type: Boolean, default: false },
    headers: { type: Object, default: () => ({}) },
    params: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue'])

const search = ref(props.modelValue)
const visible = ref(false)
const result = ref([])
const cache = new Map()

let blurTimeout = null
let leaveTimeout = null
let inputTimeout = null
let abortController = null

const apiHeaders = computed(() => {
    let token = null
    try {
        const raw = localStorage.getItem(SESSION_KEY)
        if (raw) {
            const session = JSON.parse(raw)
            token = session?.access_token
        }
    } catch {
        // ignore
    }

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

    return { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders, ...props.headers }
})

const onFocus = () => {
    if (props.disabled) return
    visible.value = true
}

const onBlur = () => {
    if (blurTimeout) clearTimeout(blurTimeout)
    blurTimeout = setTimeout(() => { visible.value = false }, 150)
}

const onDropdownLeave = () => {
    if (leaveTimeout) clearTimeout(leaveTimeout)
    leaveTimeout = setTimeout(() => {
        visible.value = false
        (document.activeElement as HTMLElement)?.blur()
    }, 200)
}

const fetchData = async () => {
    const cacheKey = String(search.value).toLowerCase().trim()

    if (cache.has(cacheKey)) {
        result.value = cache.get(cacheKey)
        return
    }

    abortController = new AbortController()

    try {
        const url = new URL(props.route, window.location.origin)
        url.searchParams.append('search', String(search.value).trim())
        for (const [key, value] of Object.entries(props.params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value)
            }
        }

        const response = await fetch(url, {
            signal: abortController.signal,
            headers: apiHeaders.value,
        })

        if (!response.ok) throw new Error('Network response was not ok')

        const jsonData = await response.json()
        const data = Array.isArray(jsonData) ? jsonData : jsonData.data || []
        const transformedData = props.transform ? props.transform(data) : data

        if (cache.size > 50) {
            const firstKey = cache.keys().next().value
            cache.delete(firstKey)
        }

        cache.set(cacheKey, transformedData)
        result.value = transformedData
    } catch (error) {
        if (error.name !== 'AbortError') {
            result.value = []
        }
    } finally {
        abortController = null
    }
}

const onInput = (val) => {
    search.value = val
    emit('update:modelValue', val)

    if (inputTimeout) clearTimeout(inputTimeout)
    if (abortController) {
        abortController.abort()
        abortController = null
    }

    inputTimeout = setTimeout(fetchData, 300)
}

onMounted(async () => {
    if (props.disabled) return
    try {
        const url = new URL(props.route, window.location.origin)
        for (const [key, value] of Object.entries(props.params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value)
            }
        }
        const response = await fetch(url, { headers: apiHeaders.value })
        if (response.ok) {
            const jsonData = await response.json()
            const data = Array.isArray(jsonData) ? jsonData : jsonData.data || []
            result.value = props.transform ? props.transform(data) : data
        }
    } catch (e) {
        // ignore
    }
})

watch(() => props.modelValue, (newValue) => {
    if (newValue !== search.value) {
        search.value = newValue
    }
}, { immediate: true })

onUnmounted(() => {
    if (blurTimeout) clearTimeout(blurTimeout)
    if (inputTimeout) clearTimeout(inputTimeout)
    if (abortController) abortController.abort()
    cache.clear()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
