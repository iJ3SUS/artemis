<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
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

        <div v-if="tree" class="p-6 overflow-x-auto">
            <div class="flex flex-col items-center gap-8">
                <TreeNode v-for="node in tree" :key="node._id" :node="node" />
            </div>
        </div>

        <div v-else class="flex items-center justify-center h-64">
            <p class="text-gray-500">Cargando organigrama...</p>
        </div>

    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const router = useRouter()

const tree = ref(null)

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/job-titles/tree'
    })

    if(!success) return

    tree.value = response

}

onMounted(() => {
    load()
})
</script>
