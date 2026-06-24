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

        <Card>
            <template #header>
                Funciones del cargo
            </template>

            <template #content>
                <Grid columns="12">
                    <Col size="12">
                        <Text
                            v-model="newFunction"
                            label="Función"
                            placeholder="Escribe una función y presiona Enter"
                            @keydown.enter.prevent="addFunction"
                        />
                    </Col>
                    <Col size="12">
                        <ul v-if="form.functions.length" class="ml-5 list-disc text-sm space-y-1">
                            <li v-for="(func, index) in form.functions" :key="index" class="flex items-center justify-between">
                                <span>{{ func }}</span>
                                <span
                                    class="text-orange-600 font-medium text-xs cursor-pointer ml-2"
                                    @click="() => removeFunction(index)"
                                >
                                    Eliminar
                                </span>
                            </li>
                        </ul>
                        <p v-else class="text-sm text-gray-400">Sin funciones asignadas</p>
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

const newFunction = ref('')

const options = computed(() => {
    return {
        jobTitles: optionStore.data['job_titles'] || []
    }
})

const addFunction = () => {
    const value = newFunction.value.trim()
    if (value && !props.form.functions.includes(value)) {
        props.form.functions.push(value)
        newFunction.value = ''
    }
}

const removeFunction = (index) => {
    props.form.functions.splice(index, 1)
}

onMounted(() => {
    optionStore.add({
        key: 'job_titles',
        source: 'dashboard/job-titles/list'
    })
})

</script>
