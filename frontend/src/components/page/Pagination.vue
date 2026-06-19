<template>
    <div class="flex items-center justify-between" :class="[
        disabled ? 'opacity-50 pointer-events-none' : ''
    ]">
        <div class="w-full">
            <p class="text-sm text-gray-700">
                Mostrando <span class="font-bold">{{ pagination.from }}</span> a <span class="font-bold">{{ pagination.to }}</span> de <span class="font-bold">{{ pagination.total }}</span> resultados
            </p>
        </div>

        <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <!-- Previous button -->
                <button
                    :disabled="pagination.page <= 1"
                    @click="handle(pagination.page - 1)"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300"
                    :class="pagination.page <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'"
                >
                    <span class="sr-only">Anterior</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                </button>
                
                <!-- Page numbers -->
                <template v-for="pageNumber in visiblePages" :key="pageNumber">
                    <button
                        @click="handle(pageNumber)"
                        class="relative inline-flex items-center px-4 py-2 text-xs ring-1 ring-inset "
                        :class="pageNumber === pagination.page ? 
                            'z-10 bg-primary-600 text-white pointer-events-none font-semibold ring-primary-600' : 
                            'text-gray-900 hover:bg-gray-50 cursor-pointer ring-gray-300'"
                    >
                        {{ pageNumber }}
                    </button>
                </template>
                
                <!-- Next button -->
                <button
                    :disabled="pagination.page >= pagination.pages"
                    @click="handle(pagination.page + 1)"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300"
                    :class="pagination.page >= pagination.pages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'"
                >
                    <span class="sr-only">Siguiente</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                </button>
            </nav>
        </div>
       
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
    pagination: {
        type: Object,
        required: true,
        default: () => ({
            page: 1,
            total: 0,
            pages: 1,
            from: 0,
            to: 0
        })
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const router = useRouter()
const route = useRoute()

const visiblePages = computed(() => {
    const maxPages = 5;
    const { page, pages } = props.pagination;
    
    if (pages <= maxPages) {
        return Array.from({ length: pages }, (_, i) => i + 1);
    }

    let start = Math.max(1, page - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;

    if (end > pages) {
        end = pages;
        start = Math.max(1, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const handle = (page) => {

    const query = { ...route.query }

    query.page = page

    router.push({
        query
    })

   
}

</script>
  