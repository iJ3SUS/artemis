<template>
    <Page :padding="false" class="org-chart-page">
        <template #heading>
            <Heading :sticky="false">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Organigrama</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Estructura jerárquica de cargos</p>
                    </div>
                </template>
            </Heading>
        </template>

        <div v-if="tree" ref="chartContainer" class="org-chart-container" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @wheel.prevent="onWheel" @touchstart="startTouchDrag" @touchmove="onTouchDrag" @touchend="stopTouchDrag">
            <div ref="chartContent" class="org-chart-root">
                <TreeNode v-for="node in tree" :key="node._id" :node="node" :is-root="true" @select="onSelectNode" />
            </div>
        </div>

        <div v-else-if="!tree" class="org-chart-container flex items-center justify-center">
            <p class="text-gray-500">Cargando organigrama...</p>
        </div>

        <Transition name="modal">
            <Modal v-if="selected_job_title" :title="selected_job_title.name" :subtitle="`${employees.length} empleado(s)`" size="sm:max-w-lg" @close="selected_job_title = null">
            <template #content>
                <div v-if="loading_employees" class="flex items-center justify-center py-8">
                    <p class="text-sm text-gray-500">Cargando empleados...</p>
                </div>

                <div v-else-if="employees.length === 0" class="flex items-center justify-center py-8">
                    <p class="text-sm text-gray-500">No hay empleados en este cargo</p>
                </div>

                <div v-else class="overflow-y-auto max-h-[50vh]">
                    <div v-for="emp in employees" :key="emp._id" class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 transition-colors odd:bg-gray-100" @click="router.push(`/employees/${emp._id}`)">
                        <Avatar :name="`${emp.names} ${emp.surnames}`" />
                        <div>
                            <p class="text-sm font-medium text-gray-900">{{ emp.names }} {{ emp.surnames }}</p>
                            <p class="text-xs text-gray-500">{{ emp.identification || '—' }} · {{ emp.email || '—' }}</p>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <Button color="gray" @handle="selected_job_title = null">Cerrar</Button>
            </template>
        </Modal>
        </Transition>

    </Page>
</template>

<script setup lang="ts">
import TreeNode from './components/TreeNode.vue'

const http = useHttp()
const router = useRouter()

const tree = ref(null)
const chartContainer = ref(null)
const chartContent = ref(null)

const selected_job_title = ref(null)
const employees = ref([])
const loading_employees = ref(false)

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const translateX = ref(0)
const translateY = ref(0)
let currentTranslateX = 0
let currentTranslateY = 0

const onSelectNode = async (node) => {
    selected_job_title.value = node
    loading_employees.value = true
    employees.value = []

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/employees/list',
        params: { job_title_id: node._id, active: true }
    })

    loading_employees.value = false

    if (success && response) {
        employees.value = Array.isArray(response) ? response : (response.items || response.data || [])
    }
}

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/job-titles/tree'
    })

    if(!success) return

    tree.value = response

    await nextTick()
    centerRoot()

}

const startDrag = (e: MouseEvent) => {
    isDragging.value = true
    startX.value = e.clientX
    startY.value = e.clientY
    chartContainer.value.style.cursor = 'grabbing'
}

const clampTranslate = () => {
    if (!chartContainer.value || !chartContent.value) return
    const containerRect = chartContainer.value.getBoundingClientRect()
    const contentRect = chartContent.value.getBoundingClientRect()
    const contentWidth = contentRect.width
    const contentHeight = contentRect.height
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    const minX = Math.min(0, containerWidth - contentWidth)
    const maxX = Math.max(0, containerWidth - contentWidth)
    const minY = Math.min(0, containerHeight - contentHeight)
    const maxY = Math.max(0, containerHeight - contentHeight)
    translateX.value = Math.max(minX, Math.min(maxX, translateX.value))
    translateY.value = Math.max(minY, Math.min(maxY, translateY.value))
}

const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    e.preventDefault()
    const dx = e.clientX - startX.value
    const dy = e.clientY - startY.value
    translateX.value = currentTranslateX + dx
    translateY.value = currentTranslateY + dy
    clampTranslate()
    if (chartContent.value) {
        chartContent.value.style.transform = `translate(${translateX.value}px, ${translateY.value}px)`
    }
}

const stopDrag = () => {
    if (!isDragging.value) return
    isDragging.value = false
    currentTranslateX = translateX.value
    currentTranslateY = translateY.value
    chartContainer.value.style.cursor = 'grab'
}

const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    translateX.value = currentTranslateX - e.deltaX
    translateY.value = currentTranslateY - e.deltaY
    clampTranslate()
    currentTranslateX = translateX.value
    currentTranslateY = translateY.value
    if (chartContent.value) {
        chartContent.value.style.transform = `translate(${translateX.value}px, ${translateY.value}px)`
    }
}

const startTouchDrag = (e: TouchEvent) => {
    const touch = e.touches[0]
    isDragging.value = true
    startX.value = touch.clientX
    startY.value = touch.clientY
}

const onTouchDrag = (e: TouchEvent) => {
    if (!isDragging.value) return
    e.preventDefault()
    const touch = e.touches[0]
    const dx = touch.clientX - startX.value
    const dy = touch.clientY - startY.value
    translateX.value = currentTranslateX + dx
    translateY.value = currentTranslateY + dy
    clampTranslate()
    if (chartContent.value) {
        chartContent.value.style.transform = `translate(${translateX.value}px, ${translateY.value}px)`
    }
}

const centerRoot = () => {
    if (!chartContainer.value || !chartContent.value) return
    const container = chartContainer.value.getBoundingClientRect()
    const rootNode = chartContent.value.querySelector('.tree-node.is-root')
    if (!rootNode) return
    const nodeRect = rootNode.getBoundingClientRect()
    const offsetX = container.left - nodeRect.left + (container.width - nodeRect.width) / 2
    const offsetY = container.top - nodeRect.top + (container.height - nodeRect.height) / 2
    translateX.value = offsetX
    translateY.value = Math.max(0, offsetY)
    currentTranslateX = translateX.value
    currentTranslateY = translateY.value
    chartContent.value.style.transform = `translate(${translateX.value}px, ${translateY.value}px)`
}

const stopTouchDrag = () => {
    if (!isDragging.value) return
    isDragging.value = false
    currentTranslateX = translateX.value
    currentTranslateY = translateY.value
}

onMounted(() => {
    load()
    if (chartContainer.value) {
        chartContainer.value.style.cursor = 'grab'
    }
    window.addEventListener('resize', centerRoot)
})

onUnmounted(() => {
    window.removeEventListener('resize', centerRoot)
})
</script>

<style scoped>
.org-chart-container {
    width: 100%;
    height: calc(100vh - 180px);
    overflow: hidden;
    user-select: none;
    position: relative;
    box-sizing: border-box;
    touch-action: none;
}

.org-chart-container * {
    user-select: none;
}

.org-chart-root {
    display: inline-flex;
    justify-content: center;
    gap: 48px;
    padding: 32px;
    min-width: max-content;
    position: absolute;
    top: 0;
    left: 0;
}

</style>
