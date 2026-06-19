<template>
    <div class="px-6 pb-6 pt-0 bg-gray-100 min-h-screen">
        <Transition 
            name="fade-slide"
            appear
            mode="out-in"
        >
            <div>
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Transición fade-slide */
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