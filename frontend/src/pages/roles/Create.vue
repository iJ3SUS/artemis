<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/roles')">
                        <Icon icon="ArrowLeft" width="16" height="16" class="text-inherit" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Crear rol</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Agrega un nuevo rol al sistema</p>
                    </div>
                </template>
                <template #actions>
                    <Button v-if="$can('roles.create')" color="primary" @handle="create" :disabled="!http.loading">Guardar</Button>
                </template>
            </Heading>
        </template>

        <Form :form :errors></Form>
    </Page>
</template>

<script setup lang="ts">
import { RoleSchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()

const optionStore = useOptionsStore()

const { form, errors, submit } = useForm(RoleSchema)

const create = async () => {

    const { success, response, message } = await submit({
        method: 'POST',
        url: 'dashboard/roles'
    })

    if(!success) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message || 'Ocurrió un error al guardar el rol',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El rol se guardó correctamente',
        confirmButtonText: 'Aceptar'
    })

    optionStore.refresh('roles')

    router.push('/roles')

}

</script>
