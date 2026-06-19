<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/users')">
                        <Icon icon="ArrowLeft" width="16" height="16" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Crear usuario</h1>
                        <p class="text-sm text-gray-500 mt-0.5">Agrega un nuevo usuario al sistema</p>
                    </div>
                </template>
                <template #actions>
                    <Button color="primary" @handle="create" :disabled="!http.loading">Guardar</Button>
                </template>
            </Heading>
        </template>

        <Form :form :errors></Form>
    </Page>
</template>

<script setup lang="ts">
import { UserSchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()

const { form, errors, submit } = useForm(UserSchema)

const create = async () => {

    form.display_name = `${form.names} ${form.surnames}`.trim()

    const { success, response } = await submit({
        method: 'POST',
        url: 'dashboard/users'
    })

    if(!success) return

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El usuario se guardó correctamente',
        confirmButtonText: 'Aceptar'
    })

    router.push('/users')

}

</script>
