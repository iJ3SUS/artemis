import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

export const useUiStore = defineStore('ui', () => {
    const menu_open = ref(false)
    const empresa = ref(import.meta.env.VITE_COMPANY_NAME || 'APOSENTOS')
    const leaving = ref(false)

    const logout = () => {
        const auth = useAuthStore()

        if (leaving.value) return
        leaving.value = true

        setTimeout(() => {
            auth.logout()
            router.push('/login')
            setTimeout(() => { leaving.value = false }, 100)
        }, 300)
    }

    return {
        menu_open,
        empresa,
        leaving,
        logout,
    }
})