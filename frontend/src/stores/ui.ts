import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
    const menu_open = ref(false)
    const empresa = ref('Mi Empresa')

    return {
        menu_open,
        empresa,
    }
})
