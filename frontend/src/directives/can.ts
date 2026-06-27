import type { DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
        const auth = useAuthStore()

        if (binding.value && !auth.can(binding.value)) {
            el.parentNode?.removeChild(el)
        }
    }
}
