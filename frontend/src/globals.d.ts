import { DateTime } from 'luxon'

declare module 'vue' {
  interface ComponentCustomProperties {
    $ParseDate: (date: string, format?: string) => DateTime
    $can: (permission: string) => boolean
    $url: (path: string) => string
  }
}
