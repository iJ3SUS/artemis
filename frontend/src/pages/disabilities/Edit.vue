<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/disabilities')">
                        <Icon icon="ArrowLeft" width="16" height="16" class="text-inherit" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Editar incapacidad</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Modifica los datos de la incapacidad</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('disabilities.update')" color="primary" @handle="update" :disabled="!http.loading">Guardar</Button>
                </template>
            </Heading>
        </template>

        <div v-if="disability">
            <Form :form :errors disabled></Form>
        </div>
    </Page>
</template>

<script setup lang="ts">
import { DisabilitySchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()
const route = useRoute()

const { form, errors, fill, submit } = useForm(DisabilitySchema)

const disability = ref(null)

const load = async () => {

    const { success, response, message } = await http.request({
        method: 'GET',
        url: `dashboard/disabilities/${route.params.id}`
    })

    if(!success) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message || 'Ocurrió un error al cargar la incapacidad',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    disability.value = response

    fill(response)

}

const update = async () => {

    const { success, message } = await submit({
        method: 'PUT',
        url: `dashboard/disabilities/${route.params.id}`
    })

    if(!success) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message || 'Ocurrió un error al actualizar la incapacidad',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'La incapacidad se actualizó correctamente',
        confirmButtonText: 'Aceptar'
    })

}

onMounted(() => {

    load()

})

</script>
