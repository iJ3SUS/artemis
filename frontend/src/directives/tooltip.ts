import type { DirectiveBinding } from 'vue'

type Position = 'top' | 'bottom' | 'left' | 'right'

interface TooltipElement extends HTMLElement {
    __tooltipWrapper?: HTMLDivElement
}

function createWrapper(position: Position, value: string): HTMLDivElement {
    const wrapper = document.createElement('div')
    wrapper.style.display = 'inline-flex'
    wrapper.setAttribute('position', position)
    wrapper.setAttribute('tooltip', value)
    return wrapper
}

function setTooltip(wrapper: HTMLDivElement, value: string, position: Position) {
    if (value) {
        wrapper.setAttribute('position', position)
        wrapper.setAttribute('tooltip', value)
    } else {
        wrapper.removeAttribute('tooltip')
        wrapper.removeAttribute('position')
    }
}

export default {
    mounted(el: TooltipElement, binding: DirectiveBinding<string>) {
        const position = (binding.arg as Position) || 'top'
        const wrapper = createWrapper(position, binding.value)
        el.parentNode?.insertBefore(wrapper, el)
        wrapper.appendChild(el)
        el.__tooltipWrapper = wrapper
    },
    updated(el: TooltipElement, binding: DirectiveBinding<string>) {
        if (binding.value !== binding.oldValue && el.__tooltipWrapper) {
            setTooltip(el.__tooltipWrapper, binding.value, (binding.arg as Position) || 'top')
        }
    },
    unmounted(el: TooltipElement) {
        if (el.__tooltipWrapper) {
            el.__tooltipWrapper.parentNode?.insertBefore(el, el.__tooltipWrapper)
            el.__tooltipWrapper.remove()
            delete el.__tooltipWrapper
        }
    }
}
