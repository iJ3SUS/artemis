<template>
    <Page :padding="false">
        <template #heading>
            <Heading :sticky="false">
                <template #back>
                    <Button color="gray" @handle="router.push('/job-titles')">
                        <Icon icon="ArrowLeft" width="16" height="16" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Organigrama</h1>
                        <p class="text-sm text-gray-500 mt-0.5">Estructura jerárquica de cargos</p>
                    </div>
                </template>
            </Heading>
        </template>

        <div v-if="tree" ref="chartContainer" class="org-chart-container" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
            <div ref="chartContent" class="org-chart-root">
                <TreeNode v-for="node in tree" :key="node._id" :node="node" :is-root="true" />
            </div>
        </div>

        <div v-else-if="!tree" class="org-chart-container flex items-center justify-center">
            <p class="text-gray-500">Cargando organigrama...</p>
        </div>

    </Page>
</template>

<script setup lang="ts">
import TreeNode from './components/TreeNode.vue'

const http = useHttp()
const router = useRouter()

const tree = ref(null)
const chartContainer = ref(null)
const chartContent = ref(null)

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const scrollLeft = ref(0)
const scrollTop = ref(0)

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/job-titles/tree'
    })

    if(!success) return

    tree.value = response

}

const startDrag = (e: MouseEvent) => {
    isDragging.value = true
    startX.value = e.pageX - chartContainer.value.offsetLeft
    startY.value = e.pageY - chartContainer.value.offsetTop
    scrollLeft.value = chartContainer.value.scrollLeft
    scrollTop.value = chartContainer.value.scrollTop
    chartContainer.value.style.cursor = 'grabbing'
}

const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    e.preventDefault()
    const x = e.pageX - chartContainer.value.offsetLeft
    const y = e.pageY - chartContainer.value.offsetTop
    const walkX = x - startX.value
    const walkY = y - startY.value
    chartContainer.value.scrollLeft = scrollLeft.value - walkX
    chartContainer.value.scrollTop = scrollTop.value - walkY
}

const stopDrag = () => {
    isDragging.value = false
    chartContainer.value.style.cursor = 'grab'
}

onMounted(() => {
    load()
    if (chartContainer.value) {
        chartContainer.value.style.cursor = 'grab'
    }
})
</script>

<style scoped>
.org-chart-container {
    height: calc(100vh - 48px);
    padding: 32px;
    overflow: auto;
    user-select: none;
    position: relative;
}

.org-chart-container * {
    user-select: none;
}

.org-chart-root {
    display: inline-flex;
    justify-content: center;
    gap: 48px;
    padding-bottom: 32px;
    min-width: 100%;
}
</style>
