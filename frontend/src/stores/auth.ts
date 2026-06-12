import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useHttp } from '@/composables/useHttp'

const SESSION_KEY = import.meta.env.VITE_SESSION_KEY || 'session'

export const useAuthStore = defineStore('auth', () => {

    const { request, setToken, clearToken } = useHttp()

    const is_logged_in = ref(false)

    const user = ref(null)

    const login = async (payload) => {

        setToken(payload)
        
        const result = await request({
            url: 'auth/me',
            headers: {
                'Authorization': 'Bearer ' + payload.access_token,
            }
        })

        if (!result.success) {

            localStorage.removeItem(SESSION_KEY)

            return false
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(payload))

        user.value = result.response
        
        is_logged_in.value = true

        return true
    }

    const check = async () => {

        let session = localStorage.getItem(SESSION_KEY)

        if (!session) {
            is_logged_in.value = false

            return false
        }

        session = JSON.parse(session)

        const response = await login(session)

        return response
    }

    const logout = () => {
        user.value = null
        is_logged_in.value = false

        localStorage.removeItem(SESSION_KEY)
        clearToken()
    }

    const can = (permission) => {
        return user.value?.permissions?.includes(permission) || false
    }

    const access_token = () => {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY))

        return session?.access_token
    }

    return {
        is_logged_in,
        user,
        check,
        login,
        logout,
        can,
        access_token
    }
})
