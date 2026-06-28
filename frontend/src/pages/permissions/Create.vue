<template>
    <Page>
        <template #heading>
            <Heading :sticky="true">
                <template #back>
                    <Button color="gray" @handle="router.push('/permissions')">
                        <Icon icon="ArrowLeft" width="16" height="16" class="text-inherit" />
                    </Button>
                </template>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Crear permiso</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Agrega un nuevo permiso al sistema</p>
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
import { PermissionSchema } from "./schemas.ts"

import Form from './components/Form.vue'

import Swal from 'sweetalert2'

const http = useHttp()

const router = useRouter()

const { form, errors, submit } = useForm(PermissionSchema)

const create = async () => {

    const { success, response } = await submit({
        method: 'POST',
        url: 'dashboard/permissions'
    })

    if(!success) return

    Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'El permiso se guardó correctamente',
        confirmButtonText: 'Aceptar'
    })

    router.push('/permissions')

}

</script>
