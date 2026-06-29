<template>
    <div>

        <Card>
            <template #header>
                Información del cargo
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="4">
                        <Text
                            v-model="form.name"
                            :errors="errors"
                            name="name"
                            label="Nombre"
                            placeholder="Nombre del cargo"
                        />
                    </Col>
                    <Col size="2">
                        <Select
                            v-model="form.parent_id"
                            :errors="errors"
                            name="parent_id"
                            label="Cargo superior"
                            option_label="name"
                            option_value="_id"
                            :options="options.jobTitles"
                            placeholder="Sin cargo superior"
                            clearable
                        />
                    </Col>
                    <Col size="6">
                        <Textarea
                            v-model="form.description"
                            :errors="errors"
                            name="description"
                            label="Descripción"
                            placeholder="Descripción del cargo"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.dependency"
                            :errors="errors"
                            name="dependency"
                            label="Dependencia"
                            placeholder="Ej: ADMINISTRACION"
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

        <RequirementsList
            v-model="form.functions"
            title="Funciones del cargo"
            label="Función"
            placeholder="Escribe una función y presiona Enter"
            empty-text="Sin funciones asignadas"
        />

        <RequirementsList
            v-model="form.requirements"
            title="Requisitos del cargo"
            label="Requisito"
            placeholder="Escribe un requisito y presiona Enter"
            empty-text="Sin requisitos asignados"
        />

        <RequirementsList
            v-model="form.risks"
            title="Riesgos del cargo"
            label="Riesgo"
            placeholder="Escribe un riesgo y presiona Enter"
            empty-text="Sin riesgos asignados"
        />

    </div>
</template>
<script setup>

import RequirementsList from './RequirementsList.vue'

const props = defineProps({
    errors: Object,
    form: Object
})

const optionStore = useOptionsStore()

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
