import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
    const menu_open = ref(false)
    const empresa = ref(import.meta.env.VITE_COMPANY_NAME || 'APOSENTOS')

    return {
        menu_open,
        empresa,
    }
})
