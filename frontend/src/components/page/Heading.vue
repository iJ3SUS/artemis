<template>
    <div ref="headingRef" :class="[
        'px-6 py-4 mb-4',
        sticky && 'sticky top-0 z-10 transition-colors duration-300'
    ]" :style="sticky ? headingStyle : {}">
        <div class="flex items-center justify-between">
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

const props = defineProps({
    sticky: {
        type: Boolean,
        default: false
    }
})

const headingRef = ref<HTMLElement | null>(null)
const scrollY = ref(0)
let initialScrollY = 0
let captured = false

const headingStyle = computed(() => {
    const diff = scrollY.value - initialScrollY
    const opacity = Math.min(Math.max(diff / 80, 0), 0.95)
    return {
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(8px)'
    }
})

const checkScroll = () => {
    if (!headingRef.value) return
    const rect = headingRef.value.getBoundingClientRect()

    if (!captured && rect.top <= 0) {
        initialScrollY = window.scrollY
        captured = true
    }

    if (captured && rect.top > 0) {
        captured = false
    }

    scrollY.value = window.scrollY
}

onMounted(() => {
    if (!props.sticky) return
    window.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
})

</script>
