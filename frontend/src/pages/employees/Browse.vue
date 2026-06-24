<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Empleados</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Gestiona los empleados de la empresa</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="router.push('/employees/create')">
                        <Icon icon="Plus" width="16" height="16" class="text-inherit" />
                        Nuevo empleado
                    </Button>
                </template>
            </Heading>
        </template>

        <Table v-if="employees">
            <template #top>
                <div class="p-4">
                    <Text v-model="inputs.search" label="Buscar" name="search" placeholder="Nombre, identificación, email" />
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Empleado</Column>
                    <Column class="text-center">Email</Column>
                    <Column class="text-center">Cargo</Column>
                    <Column class="text-center">Tipo contrato</Column>
                    <Column class="text-center">Género</Column>
                    <Column class="text-center">Ciudad</Column>
                    <Column class="text-center">Estado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <Row v-for="emp in employees.items" :key="emp._id">
                    <Column>
                        <p class="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600" @click="router.push(`/employees/${emp._id}`)">{{ emp.names }} {{ emp.surnames }}</p>
                        <p class="text-xs text-gray-500">{{ emp.identification }}</p>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ emp.email || '-' }}</p>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <p class="text-sm text-gray-700">{{ getJobTitleName(emp.job_title_id) }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <p class="text-sm text-gray-700">{{ getContractTypeLabel(emp.contract_type) }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <span class="text-sm text-gray-700">{{ getGenderLabel(emp.gender) }}</span>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <p class="text-sm text-gray-700">{{ getCityLabel(emp.city) }}</p>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="emp.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                {{ emp.active ? 'Activo' : 'Inactivo' }}
                            </span>
                        </div>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button theme="icon" title="Ver detalle" @handle="router.push(`/employees/${emp._id}`)">
                                <Icon icon="Eye" width="16" height="16" class="text-inherit" />
                            </Button>
                            <Button theme="icon" title="Editar" @handle="router.push(`/employees/${emp._id}/edit`)">
                                <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                            </Button>
                            <Button theme="icon" title="Actualizar salario" @handle="current.employee = emp; modal.salary = true">
                                <Icon icon="EyeDolar" width="16" height="16" class="text-inherit" />
                            </Button>
                        </div>
                    </Column>
                </Row>
            </template>

            <template #pagination>
                <Pagination :pagination="employees.pagination" />
            </template>
        </Table>

        <UpdateSalary
            v-if="current.employee"
            :show="modal.salary"
            :employee="current.employee"
            @close="modal.salary = false; current.employee = null"
            @saved="load"
        />

    </Page>
</template>

<script setup lang="ts">
import UpdateSalary from './components/UpdateSalary.vue'

const http = useHttp()
const route = useRoute()
const router = useRouter()
const optionStore = useOptionsStore()

const employees = ref(null)

const modal = reactive({
    salary: false
})

const current = reactive({
    employee: null
})

const inputs = reactive({
    search: ''
})

const jobTitles = computed(() => {
    return optionStore.data['job_titles'] || []
})

const getJobTitleName = (jobTitleId) => {
    if (!jobTitleId) return '-'
    const jt = jobTitles.value.find(j => j._id === jobTitleId)
    return jt ? jt.name : '-'
}

const getGenderLabel = (gender) => {
    const labels = { male: 'Masculino', female: 'Femenino', other: 'Otro' }
    return labels[gender] || '-'
}

const getCityLabel = (city) => {
    if (!city || !city.city_name || city.city_name === 'No definido') return '-'
    return city.city_name
}

const getContractTypeLabel = (contract_type) => {
    const labels = { 1: 'Fijo', 2: 'Indefinido', 3: 'Obra labor', 4: 'Prestación de servicios' }
    return labels[contract_type] || '-'
}

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/employees',
        params: {
            page: route.query?.page || 1,
            limit: 15
        }
    })

    if(!success) return

    employees.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    load()
    optionStore.add({
        key: 'job_titles',
        source: 'dashboard/job-titles/list'
    })
})
</script>
