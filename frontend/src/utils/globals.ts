import { DateTime } from 'luxon'
import { useAuthStore } from '@/stores/auth'

const timezone = import.meta.env.VITE_TIMEZONE || 'America/Bogota'
const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

export const ParseDate = (date: string, format: string = defaultFormat): DateTime => {

    if(!date) return null
    
    return DateTime.fromFormat(date, format, { zone: 'UTC' }).setZone(timezone)
}

export const can = (permission: string): boolean => {
    const auth = useAuthStore()
    return auth.can(permission)
}

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const url = (path: string): string => {
    return `${apiBase}/${path}`
}
