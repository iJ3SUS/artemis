<template>
    <div class="space-y-6">
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
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Ciudad de residencia</label>
                                <p class="text-sm text-gray-900 mt-1">{{ getCityLabel(employee.city) }}</p>
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
                <div class="space-y-6">
                    <Grid columns="2">
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Cargo</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.job_title?.name || '-' }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Salario</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ formatCurrency(employee.salary) }}</p>
                                </div>
                                <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Tipo de contrato</label>
                                <p class="text-sm text-gray-900 mt-1">{{ getContractTypeLabel(employee.contract_type) }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Fecha de ingreso</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ $ParseDate(employee.entry_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
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
                                    <p class="text-sm text-gray-900 mt-1">{{ $ParseDate(employee.retirement_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                                </div>
                            </div>
                        </Col>
                    </Grid>

                    <hr class="border-gray-200">

                    <Grid columns="2">
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">EPS</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.eps || '-' }}</p>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">AFP</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.afp || '-' }}</p>
                                </div>
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">AFC</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ employee.afc || '-' }}</p>
                                </div>
                            </div>
                        </Col>
                    </Grid>

                    <hr class="border-gray-200">

                    <Grid columns="2">
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Escolaridad</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ getEducationLevelLabel(employee.education_level) }}</p>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div class="space-y-4">
                                <div>
                                    <label class="text-xs font-medium text-gray-500 uppercase">Medio de transporte</label>
                                    <p class="text-sm text-gray-900 mt-1">{{ getTransportTypeLabel(employee.transport_type) }}</p>
                                </div>
                            </div>
                        </Col>
                    </Grid>
                </div>
            </template>
        </Card>

        <Card>
            <template #header>
                Información de dotación
            </template>

            <template #content>
                <Grid columns="2">
                    <Col>
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Calzado</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.clothing?.shoe_size || '-' }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Camisa</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.clothing?.shirt_size || '-' }}</p>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Chaqueta</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.clothing?.jacket_size || '-' }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Pantalón</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.clothing?.pants_size || '-' }}</p>
                            </div>
                        </div>
                    </Col>
                </Grid>
            </template>
        </Card>

        <Card>
            <template #header>
                Información clínica
            </template>

            <template #content>
                <Grid columns="2">
                    <Col>
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Tipo de sangre</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.blood_type || '-' }}</p>
                            </div>
                        </div>
                    </Col>
                </Grid>
            </template>

            <template #footer>
                <div class="border-t border-gray-200 divide-y divide-gray-200 bg-gray-50">
                    <div class="px-4 py-5 space-y-3">
                        <h4 class="text-sm font-semibold text-gray-700">Medicamentos</h4>
                        <div v-if="employee.medications?.length" class="flex flex-wrap gap-2">
                            <span v-for="(item, index) in employee.medications" :key="index"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-full">
                                {{ item }}
                            </span>
                        </div>
                        <p v-else class="text-sm text-gray-400">Sin medicamentos registrados</p>
                    </div>

                    <div class="px-4 py-5 space-y-3">
                        <h4 class="text-sm font-semibold text-gray-700">Alergias</h4>
                        <div v-if="employee.allergies?.length" class="flex flex-wrap gap-2">
                            <span v-for="(item, index) in employee.allergies" :key="index"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-full">
                                {{ item }}
                            </span>
                        </div>
                        <p v-else class="text-sm text-gray-400">Sin alergias registradas</p>
                    </div>

                    <div class="px-4 py-5 space-y-3">
                        <h4 class="text-sm font-semibold text-gray-700">Enfermedades</h4>
                        <div v-if="employee.illnesses?.length" class="flex flex-wrap gap-2">
                            <span v-for="(item, index) in employee.illnesses" :key="index"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-full">
                                {{ item }}
                            </span>
                        </div>
                        <p v-else class="text-sm text-gray-400">Sin enfermedades registradas</p>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #header>
                Contacto de emergencia
            </template>

            <template #content>
                <Grid columns="2">
                    <Col>
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Nombre</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.emergency_contact?.name || '-' }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Parentezco</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.emergency_contact?.relationship || '-' }}</p>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div class="space-y-4">
                            <div>
                                <label class="text-xs font-medium text-gray-500 uppercase">Teléfono</label>
                                <p class="text-sm text-gray-900 mt-1">{{ employee.emergency_contact?.phone || '-' }}</p>
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
</template>

<script setup lang="ts">

defineProps<{
    employee: Record<string, any>
}>()

const getCityLabel = (city) => {
    if (!city || !city.city_name || city.city_name === 'No definido') return '-'
    return `${city.city_name} - ${city.state_name}`
}

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

const getEducationLevelLabel = (value) => {
    const labels = { primary: 'Primaria', secondary: 'Secundaria', technical: 'Técnico', technologist: 'Tecnólogo', professional: 'Profesional', specialization: 'Especialización', master: 'Maestría', doctorate: 'Doctorado' }
    return labels[value] || '-'
}

const getTransportTypeLabel = (value) => {
    const labels = { car: 'Carro', motorcycle: 'Moto', bicycle: 'Bicicleta', public: 'Transporte público', walking: 'A pie', other: 'Otro' }
    return labels[value] || '-'
}

const formatCurrency = (value: number) => {
    if (!value) return '-'
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value)
}

</script>
