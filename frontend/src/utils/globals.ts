import { DateTime } from 'luxon'

const timezone = import.meta.env.VITE_TIMEZONE || 'America/Bogota'
const defaultFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

export const ParseDate = (date: string, format: string = defaultFormat): DateTime => {
    return DateTime.fromFormat(date, format, { zone: 'UTC' }).setZone(timezone)
}
