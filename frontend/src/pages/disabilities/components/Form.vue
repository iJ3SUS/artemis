<template>
    <div>

        <Card>
            <template #header>
                Información de la incapacidad
            </template>

            <template #content>
                <Grid columns="12">
                    <Col size="12">
                        <SearchSelect
                            v-model="search.employee"
                            :errors="errors"
                            name="employee._id"
                            label="Empleado"
                            :route="$url('dashboard/employees/list')"
                            :disabled="disabled"
                        >
                            <template #items="{ result }">
                                <div
                                    v-for="item in result"
                                    :key="item._id"
                                    class="px-3 py-2.5 cursor-pointer hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                                    @mousedown.prevent="selectEmployee(item)"
                                >
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                            {{ item.display_name?.charAt(0)?.toUpperCase() }}
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="font-medium text-gray-900 truncate">{{ item.display_name }}</p>
                                            <div class="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                                <span>{{ item.identification }}</span>
                                                <span v-if="item.email" class="truncate">{{ item.email }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </SearchSelect>
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.start_date"
                            :errors="errors"
                            name="start_date"
                            label="Fecha de inicio"
                            type="date"
                            :transform="(val) => $ParseDate(val)?.toFormat('yyyy-MM-dd') ?? ''"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.end_date"
                            :errors="errors"
                            name="end_date"
                            label="Fecha de terminación"
                            type="date"
                            :transform="(val) => $ParseDate(val)?.toFormat('yyyy-MM-dd') ?? ''"
                        />
                    </Col>
                    <Col size="12">
                        <Textarea
                            v-model="form.notes"
                            :errors="errors"
                            name="notes"
                            label="Observación"
                            placeholder="Observaciones adicionales"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

        <Card class="mt-4">
            <template #header>
                Enfermedades
            </template>

            <template #content>
                        <SearchSelect
                            v-model="search.diseaseQuery"
                    :errors="errors"
                    name="diseases"
                    label="Buscar enfermedad"
                    :route="$url('dashboard/diseases/list')"
                >
                    <template #items="{ result }">
                        <div
                            v-for="item in result"
                            :key="item._id"
                            class="px-3 py-2.5 text-sm border-b border-gray-100 last:border-b-0"
                            :class="isDiseaseSelected(item) ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 text-gray-900'"
                            @mousedown.prevent="isDiseaseSelected(item) ? null : addDisease(item)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                                    :class="isDiseaseSelected(item) ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'">
                                    {{ item.code?.charAt(0)?.toUpperCase() }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="font-medium truncate">{{ item.code }}</p>
                                    <p class="text-xs text-gray-500 truncate mt-0.5">{{ item.name }}</p>
                                </div>
                                <svg v-if="isDiseaseSelected(item)" class="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                            </div>
                        </div>
                    </template>
                </SearchSelect>
                <div v-if="form.diseases?.length" class="mt-3 flex flex-wrap gap-2">
                    <span
                        v-for="(d, i) in form.diseases"
                        :key="d._id"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                        {{ d.code }}<span v-if="d.description" class="font-normal ml-1">— {{ d.description }}</span>
                        <button
                            type="button"
                            class="w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-blue-200 text-blue-600 shrink-0"
                            @click="removeDisease(i)"
                        >
                            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </span>
                </div>
                <p v-if="form.diseases?.length" class="mt-2 text-xs text-gray-500">{{ form.diseases.length }} enfermedad(es) seleccionada(s)</p>
            </template>
        </Card>

        <pre class="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-x-auto">{{ JSON.stringify(form, null, 4) }}</pre>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    errors: Object,
    form: Object,
    disabled: Boolean
})

const search = reactive({
    employee: '',
    diseaseQuery: ''
})

const selectEmployee = (item) => {
    props.form.employee = {
        _id: item._id,
        display_name: item.display_name,
    }
    search.employee = item.display_name
}

const isDiseaseSelected = (item) => {
    return props.form.diseases?.some(d => d._id === item._id)
}

const addDisease = (item) => {
    if (!props.form.diseases) {
        props.form.diseases = []
    }
    if (isDiseaseSelected(item)) return
    props.form.diseases.push({
        _id: item._id,
        code: item.code,
        description: item.name
    })
}

const removeDisease = (index) => {
    props.form.diseases.splice(index, 1)
}

watch(() => props.form?.employee, (val) => {
    if (val?.display_name) {
        search.employee = `${val.display_name}`
    }
}, { immediate: true })

</script>
