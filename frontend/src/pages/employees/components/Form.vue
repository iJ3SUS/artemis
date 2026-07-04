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
                            disabled
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
                    <Col size="2">
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
                    <Col size="2">
                        <Text
                            v-model="form.birth_date"
                            :errors="errors"
                            name="birth_date"
                            label="F. nacimiento"
                            type="date"
                            :transform="formatDateInput"
                        />
                    </Col>
                    <Col size="2">
                        <Select
                            v-model="form.stratum"
                            :errors="errors"
                            name="stratum"
                            label="Estrato"
                            :options="stratumOptions"
                            placeholder="Seleccionar"
                            clearable
                        />
                    </Col>
                    <Col size="2">
                        <Text
                            v-model="form.dependents"
                            :errors="errors"
                            name="dependents"
                            label="Personas a cargo"
                            type="number"
                            placeholder="0"
                        />
                    </Col>
                    <Col size="4">
                        <Select
                            v-model="form.city.city_code"
                            :errors="errors"
                            name="city"
                            label="Ciudad de residencia"
                            option_label="label"
                            option_value="city_code"
                            :options="cities.data.value"
                            placeholder="Seleccionar ciudad"
                            @change="onCityChange"
                        />
                    </Col>
                    <Col size="2">
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
                Información laboral
            </template>

            <template #content>
                <div class="space-y-6">
                    <Grid columns="6">
                        <Col size="3">
                            <Select
                                v-model="form.job_title_id"
                                :errors="errors"
                                name="job_title_id"
                                label="Cargo"
                                option_label="name"
                                option_value="_id"
                                :options="options.job_titles"
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
                                :transform="formatDateInput"
                            />
                        </Col>
                        <Col size="3">
                            <Text
                                v-model="form.retirement_date"
                                :errors="errors"
                                name="retirement_date"
                                label="Fecha de retiro"
                                type="date"
                                :transform="formatDateInput"
                            />
                        </Col>
                    </Grid>

                    <hr class="border-gray-200">

                    <Grid columns="6">
                        <Col size="2">
                            <Text
                                v-model="form.eps"
                                :errors="errors"
                                name="eps"
                                label="EPS"
                                placeholder="Nombre de la EPS"
                            />
                        </Col>
                        <Col size="2">
                            <Text
                                v-model="form.afp"
                                :errors="errors"
                                name="afp"
                                label="AFP"
                                placeholder="Nombre de la AFP"
                            />
                        </Col>
                        <Col size="2">
                            <Text
                                v-model="form.afc"
                                :errors="errors"
                                name="afc"
                                label="AFC"
                                placeholder="Nombre de la AFC"
                            />
                        </Col>
                    </Grid>

                    <hr class="border-gray-200">

                    <Grid columns="6">
                        <Col size="2">
                            <Select
                                v-model="form.transport_type"
                                :errors="errors"
                                name="transport_type"
                                label="Medio de transporte"
                                :options="transportTypeOptions"
                                placeholder="Seleccionar"
                                clearable
                            />
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
                <Grid columns="6">
                    <Col size="3">
                        <Text
                            v-model="form.shoe_size"
                            :errors="errors"
                            name="shoe_size"
                            label="Calzado"
                            placeholder="Talla de calzado"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.shirt_size"
                            :errors="errors"
                            name="shirt_size"
                            label="Camisa"
                            placeholder="Talla de camisa"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.jacket_size"
                            :errors="errors"
                            name="jacket_size"
                            label="Chaqueta"
                            placeholder="Talla de chaqueta"
                        />
                    </Col>
                    <Col size="3">
                        <Text
                            v-model="form.pants_size"
                            :errors="errors"
                            name="pants_size"
                            label="Pantalón"
                            placeholder="Talla de pantalón"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>

        <Card>
            <template #header>
                Información clínica
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="2">
                        <Select
                            v-model="form.blood_type"
                            :errors="errors"
                            name="blood_type"
                            label="Tipo de sangre"
                            :options="bloodTypeOptions"
                            placeholder="Seleccionar"
                            clearable
                        />
                    </Col>
                </Grid>
            </template>

            <template #footer>
                <div class="border-t border-gray-200 divide-y divide-gray-200 bg-gray-50">
                    <ListInput
                        v-model="form.medications"
                        title="Medicamentos"
                        placeholder="Escribe un medicamento y presiona Enter"
                        empty-text="Sin medicamentos registrados"
                    />

                    <ListInput
                        v-model="form.allergies"
                        title="Alergias"
                        placeholder="Escribe una alergia y presiona Enter"
                        empty-text="Sin alergias registradas"
                    />

                    <ListInput
                        v-model="form.illnesses"
                        title="Enfermedades"
                        placeholder="Escribe una enfermedad y presiona Enter"
                        empty-text="Sin enfermedades registradas"
                    />
                </div>
            </template>
        </Card>

        <Card>
            <template #header>
                Contacto de emergencia
            </template>

            <template #content>
                <Grid columns="6">
                    <Col size="2">
                        <Text
                            v-model="form.emergency_contact.name"
                            :errors="errors"
                            name="emergency_contact.name"
                            label="Nombre"
                            placeholder="Nombre del contacto"
                        />
                    </Col>
                    <Col size="2">
                        <Text
                            v-model="form.emergency_contact.relationship"
                            :errors="errors"
                            name="emergency_contact.relationship"
                            label="Parentezco"
                            placeholder="Ej: Esposo, Madre"
                        />
                    </Col>
                    <Col size="2">
                        <Text
                            v-model="form.emergency_contact.phone"
                            :errors="errors"
                            name="emergency_contact.phone"
                            label="Teléfono"
                            placeholder="Número de contacto"
                        />
                    </Col>
                </Grid>
            </template>
        </Card>
    </div>
</template>
<script setup>
import { genderOptions, contractTypeOptions, stratumOptions, transportTypeOptions, bloodTypeOptions } from '../options.ts'
import ListInput from './ListInput.vue'

const props = defineProps({
    errors: Object,
    form: Object
})

const optionStore = useOptionsStore()
const cities = useCities()

const options = computed(() => {
    return {
        job_titles: optionStore.data['job_titles'] || []
    }
})

const onCityChange = (city_code) => {
    
    if (!city_code) {
        props.form.city = {
            country_code: 'Co',
            country_name: 'Colombia',
            state_code: '00',
            state_name: 'No definido',
            city_code: '00000',
            city_name: 'No definido'
        }
        return
    }
    const option = cities.data.value.find(o => o.city_code === city_code)

    if (option) {
        props.form.city = {
            country_code: option.country_code,
            country_name: option.country_name,
            state_code: option.state_code,
            state_name: option.state_name,
            city_code: option.city_code,
            city_name: option.city_name
        }
    }

}


const formatDateInput = (val) => {
    if (!val) return ''
    const str = String(val)
    try {
        return $ParseDate(str)?.toFormat('yyyy-MM-dd') ?? ''
    } catch {
        return str.length >= 10 ? str.substring(0, 10) : str
    }
}

onMounted(() => {

    optionStore.add({
        key: 'job_titles',
        source: 'dashboard/job-titles/list'
    })
    
    cities.load()
})

</script>
