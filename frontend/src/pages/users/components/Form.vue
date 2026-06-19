<template>
    <div>

        <Card>
            <template #header>
                Información básica
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="3">
                        <Text
                            v-model="form.names"
                            :errors="errors"
                            name="names"
                            label="Nombres"
                            placeholder="Nombres"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.surnames"
                            :errors="errors"
                            name="surnames"
                            label="Apellidos"
                            placeholder="Apellidos"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.identification"
                            :errors="errors"
                            name="identification"
                            label="Identificación"
                            placeholder="Identificación"
                        />
                    </Col>
                    <Col size="3">
                        <Checkbox
                            v-model="form.active"
                            :errors="errors"
                            name="active"
                            label="Usuario activo"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

        <Card>
            <template #header>
                Datos de contacto
            </template>

            <template #content>

                <div class="flex items-start gap-3 p-3 mb-6 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
                    <p>
                        El <span class="font-semibold text-gray-900">email</span> es necesario para iniciar sesión en el sistema.
                    </p>
                </div>

                <Grid columns="12">
                    <Col size="12">
                        <Text
                            v-model="form.email"
                            label="Email"
                            name="email"
                            :errors="errors"
                        />
                    </Col>
                </Grid>

                <Grid>
                    <Col size="6">
                        <Text
                            v-model="form.phone.indicative"
                            label="Indicativo"
                            name="phone.indicative"
                            :errors="errors"
                        />
                    </Col>
                    <Col size="6">
                        <Text
                            v-model="form.phone.number"
                            label="Número de teléfono"
                            name="phone.number"
                            :errors="errors"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

        <Card>
            <template #header>
                Roles
            </template>

            <template #content>
                <Grid columns="1">
                    <Col>
                        <Select
                            v-model="role"
                            label="Agregar rol"
                            option_label="name"
                            option_value="_id"
                            :options="roles"
                            @change="(e) => {

                                const find = roles.find(role => role._id == e)

                                if(find && !form.roles.includes(find._id)){
                                    form.roles.push(find._id)
                                }

                                ctx.setTimeout(() => {
                                    role = null
                                }, 50)

                            }"
                        />
                    </Col>
                    <Col>
                        <ul class="ml-5 list-disc text-sm">
                            <li v-for="(item, index) in selected_roles">
                                {{ item.name }}
                                <span
                                    class="text-orange-600 font-medium text-xs cursor-pointer"
                                    @click="() => {
                                        form.roles.splice(index, 1)
                                    }"
                                >
                                    Eliminar
                                </span>
                            </li>
                        </ul>
                    </Col>
                </Grid>
            </template>
        </Card>

    </div>
</template>
<script setup>

const props = defineProps({
    errors: Object,
    form: Object,
    roles: Array,
    edit: Boolean
})

const ctx = window

const role = ref(null)

const selected_roles = computed(() => {
    return props.form.roles
        .map(id => props.roles.find(role => role._id == id))
        .filter(role => role !== undefined)
})

</script>
