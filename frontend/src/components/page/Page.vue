<template>
    <div class="bg-gray-100 min-h-screen">
        <slot name="heading"></slot>
        <hr class="border-gray-200 mx-6 mb-6" />
        <Transition 
            name="fade-slide"
            appear
            mode="out-in"
        >
            <div :class="contentClasses">
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    padding: { type: Boolean, default: true }
})

const contentClasses = computed(() => {
    return props.padding ? 'px-6 pb-6 pt-0' : ''
})

</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
