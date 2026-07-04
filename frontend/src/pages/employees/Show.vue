<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/employees')">
                        <Icon icon="ArrowLeft" width="16" height="16" class="text-inherit" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Detalle del empleado</h1>
                        <p class="text-sm text-gray-600 mt-0.5">{{ employee?.display_name }}</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('employees.update')" color="primary" @handle="router.push(`/employees/${route.params.id}/edit`)">
                        <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                        Editar
                    </Button>
                </template>
            </Heading>
        </template>

        <div v-if="employee" class="space-y-6">
            <div class="flex gap-1 p-1 rounded-lg bg-gray-100 w-fit">
                <button
                    class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                    :class="$route.path.endsWith('/info') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                    @click="router.push(`/employees/${route.params.id}/info`)"
                >Información</button>
                <button
                    class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                    :class="$route.path.endsWith('/family') ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
                    @click="router.push(`/employees/${route.params.id}/family`)"
                >Familiares</button>
            </div>

            <router-view :employee="employee" />
        </div>
    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const router = useRouter()
const route = useRoute()

const employee = ref(null)

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: `dashboard/employees/${route.params.id}`
    })

    if(!success) return

    employee.value = response

}

watch(() => route.params.id, () => {
    load()
})

onMounted(() => {
    load()
})

</script>
