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
                        <Text
                            v-model.number="form.level"
                            :errors="errors"
                            name="level"
                            label="Nivel"
                            placeholder="0"
                            type="number"
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
