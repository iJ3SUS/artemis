<template>
    <Page :padding="false" class="org-chart-page">
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

        <div v-if="tree" ref="chartContainer" class="org-chart-container" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag" @wheel.prevent="onWheel">
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
const translateX = ref(0)
const translateY = ref(0)
let currentTranslateX = 0
let currentTranslateY = 0

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
    startX.value = e.clientX
    startY.value = e.clientY
    chartContainer.value.style.cursor = 'grabbing'
}

const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    e.preventDefault()
    const dx = e.clientX - startX.value
    const dy = e.clientY - startY.value
    translateX.value = currentTranslateX + dx
    translateY.value = currentTranslateY + dy
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
    currentTranslateX = translateX.value
    currentTranslateY = translateY.value
    if (chartContent.value) {
        chartContent.value.style.transform = `translate(${translateX.value}px, ${translateY.value}px)`
    }
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
    width: 100%;
    height: calc(100vh - 48px);
    overflow: hidden;
    user-select: none;
    position: relative;
    box-sizing: border-box;
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
