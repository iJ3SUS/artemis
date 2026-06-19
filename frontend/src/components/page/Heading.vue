<template>
    <div ref="headingRef" :class="[
        'px-6 py-4 mb-8',
        sticky && 'sticky top-0 z-10 border-b border-gray-200 transition-colors duration-200',
        scrolled && 'bg-white shadow-xs'
    ]">
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
const scrolled = ref(false)
let initialTop = 0

onMounted(() => {
    if (!props.sticky) return

    initialTop = headingRef.value?.getBoundingClientRect().top ?? 0

    const observer = new IntersectionObserver(
        ([entry]) => {
            scrolled.value = entry.intersectionRatio < 1
        },
        { threshold: [0, 1] }
    )

    if (headingRef.value) {
        observer.observe(headingRef.value)
    }

    onUnmounted(() => observer.disconnect())
})

</script>
