<template>
    <div class="flex flex-col items-center">
        <div class="px-4 py-2 bg-white border-2 border-primary-500 rounded-lg shadow-sm min-w-[180px] text-center">
            <p class="text-sm font-semibold text-gray-900">{{ node.name }}</p>
            <p v-if="node.description" class="text-xs text-gray-500 mt-1">{{ node.description }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                Nivel {{ node.level }}
            </span>
        </div>

        <div v-if="node.children && node.children.length > 0" class="flex flex-col items-center mt-4">
            <div class="w-px h-6 bg-gray-300"></div>

            <div class="flex gap-6 items-start">
                <template v-for="child in node.children" :key="child._id">
                    <div class="flex flex-col items-center">
                        <div class="w-px h-4 bg-gray-300"></div>
                        <TreeNode :node="child" />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    node: Object
})

</script>
