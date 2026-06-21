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
                        <p class="text-sm text-gray-600 mt-0.5">{{ employee?.names }} {{ employee?.surnames }}</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="router.push(`/employees/${route.params.id}/edit`)">
                        <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                        Editar
                    </Button>
                </template>
            </Heading>
        </template>

        <div v-if="employee" class="space-y-6">
            <Card>
                <template #header>
                    Información personal
                </template>

                <template #content>
                    <Grid columns="2">
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Identificación</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.identification }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Nombres</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.names }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Apellidos</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.surnames }}</p>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Email</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.email || '-' }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Teléfono</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ formatPhone(employee.phone) }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Género</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ getGenderLabel(employee.gender) }}</p>
                                </div>
                            </div>
                        </Col>
                    </Grid>
                </template>
            </Card>

            <Card>
                <template #header>
                    Información laboral
                </template>

                <template #content>
                    <Grid columns="2">
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Cargo</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.job_title?.name || '-' }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Tipo de contrato</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ getContractTypeLabel(employee.contract_type) }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Fecha de ingreso</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ $ParseDate(employee.entry_date).toFormat('dd/MM/yyyy') }}</p>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Estado</label>
                                    <div class="mt-1">
                                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                            :class="employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                            {{ employee.active ? 'Activo' : 'Inactivo' }}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Fecha de retiro</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.retirement_date ? $ParseDate(employee.retirement_date).toFormat('dd/MM/yyyy') : '-' }}</p>
                                </div>
                            </div>
                        </Col>
                    </Grid>
                </template>
            </Card>

            <Card v-if="employee.functions?.length">
                <template #header>
                    Funciones del cargo
                </template>

                <template #content>
                    <ul class="ml-5 list-disc text-sm space-y-1">
                        <li v-for="(func, index) in employee.functions" :key="index" class="text-gray-700">
                            {{ func }}
                        </li>
                    </ul>
                </template>
            </Card>
        </div>
    </Page>
</template>

<script setup lang="ts">

const http = useHttp()
const router = useRouter()
const route = useRoute()

const employee = ref(null)

const formatPhone = (phone) => {
    if (!phone || (!phone.indicative && !phone.number)) return '-'
    const parts = [phone.indicative, phone.number].filter(Boolean)
    return parts.join(' ')
}

const getGenderLabel = (gender) => {
    const labels = { male: 'Masculino', female: 'Femenino', other: 'Otro' }
    return labels[gender] || '-'
}

const getContractTypeLabel = (contract_type) => {
    const labels = { 1: 'Fijo', 2: 'Indefinido', 3: 'Obra labor', 4: 'Prestación de servicios' }
    return labels[contract_type] || '-'
}

const load = async () => {

    const { success, response } = await http.request({
        method: 'GET',
        url: `dashboard/employees/${route.params.id}`
    })

    if(!success) return

    employee.value = response

}

onMounted(() => {
    load()
})

</script>
