<template>
    <div>

        <Card>
            <template #header>
                Información personal
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="3">
                        <Text
                            v-model="form.names"
                            :errors="errors"
                            name="names"
                            label="Nombres"
                            placeholder="Nombres del empleado"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.surnames"
                            :errors="errors"
                            name="surnames"
                            label="Apellidos"
                            placeholder="Apellidos del empleado"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.identification"
                            :errors="errors"
                            name="identification"
                            label="Identificación"
                            placeholder="Número de identificación"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.email"
                            :errors="errors"
                            name="email"
                            label="Email"
                            placeholder="Correo electrónico"
                        />
                    </Col>
                    <Col size="2">
                        <Text
                            v-model="form.phone.indicative"
                            :errors="errors"
                            name="phone.indicative"
                            label="Indicativo"
                            placeholder="311"
                        />
                    </Col>
                    <Col size="4">
                        <Text
                            v-model="form.phone.number"
                            :errors="errors"
                            name="phone.number"
                            label="Teléfono"
                            placeholder="Número de teléfono"
                        />
                    </Col>
                    <Col size="3">
                        <Select
                            v-model="form.gender"
                            :errors="errors"
                            name="gender"
                            label="Género"
                            :options="genderOptions"
                            placeholder="Seleccionar"
                            clearable
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

        <Card>
            <template #header>
                Información laboral
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="3">
                        <Select
                            v-model="form.job_title_id"
                            :errors="errors"
                            name="job_title_id"
                            label="Cargo"
                            option_label="name"
                            option_value="_id"
                            :options="options.jobTitles"
                            placeholder="Seleccionar cargo"
                            clearable
                        />
                    </Col>
                    <Col size="3">
                        <Select
                            v-model="form.contract_type"
                            :errors="errors"
                            name="contract_type"
                            label="Tipo de contrato"
                            :options="contractTypeOptions"
                            placeholder="Seleccionar tipo"
                            clearable
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.entry_date"
                            :errors="errors"
                            name="entry_date"
                            label="Fecha de ingreso"
                            type="date"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.retirement_date"
                            :errors="errors"
                            name="retirement_date"
                            label="Fecha de retiro"
                            type="date"
                        />
                    </Col>
                    <Col size="3">
                        <Switch
                            v-model="form.active"
                            :errors="errors"
                            name="active"
                            label="Activo"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

    </div>
</template>
<script setup>

const props = defineProps({
    errors: Object,
    form: Object
})

const optionStore = useOptionsStore()

const genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' }
]

const contractTypeOptions = [
    { label: 'Fijo', value: 1 },
    { label: 'Indefinido', value: 2 },
    { label: 'Obra labor', value: 3 },
    { label: 'Prestación de servicios', value: 4 }
]

const options = computed(() => {
    return {
        jobTitles: optionStore.data['job_titles'] || []
    }
})

onMounted(() => {
    optionStore.add({
        key: 'job_titles',
        source: 'dashboard/job-titles/list'
    })
})

</script>
