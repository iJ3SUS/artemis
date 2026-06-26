import type { DirectiveBinding } from 'vue'

type Position = 'top' | 'bottom' | 'left' | 'right'

function setTooltip(el: HTMLElement, value: string, position: Position) {
    if (value) {
        el.setAttribute('position', position)
        el.setAttribute('tooltip', value)
    } else {
        el.removeAttribute('tooltip')
        el.removeAttribute('position')
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
        setTooltip(el, binding.value, (binding.arg as Position) || 'top')
    },
    updated(el: HTMLElement, binding: DirectiveBinding<string>) {
        if (binding.value !== binding.oldValue) {
            setTooltip(el, binding.value, (binding.arg as Position) || 'top')
        }
    }
}
