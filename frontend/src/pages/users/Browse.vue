<template>
    <div class="p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p class="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
        </div>

        <Table v-if="module">
            <template #top>
                <div class="p-4 flex justify-between items-center">
                    
                    <Text v-model="inputs.search" label="Buscar" name="search" placeholder="Nombre, email, identificación" />
                    
                </div>
            </template>

            <template #head>
                <Row>
                    <Column class="text-center">Nombre</Column>
                    <Column class="text-center">Email</Column>
                    <Column class="text-center">Identificación</Column>
                    <Column class="text-center">Estado</Column>
                    <Column class="text-center">Acciones</Column>
                </Row>
            </template>

            <template #body>
                <Row v-for="user in module.items" :key="user._id">
                    <Column>
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span class="text-sm font-semibold text-primary-600">AB</span>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ user.display_name || user.names }}</p>
                                <p class="text-xs text-gray-500">{{ user.names }} {{ user.surnames }}</p>
                            </div>
                        </div>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ user.email }}</p>
                    </Column>
                    <Column>
                        <p class="text-sm text-gray-700">{{ user.identification }}</p>
                    </Column>
                    <Column>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            {{ user.active ? 'Activo' : 'Inactivo' }}
                        </span>
                    </Column>
                    <Column>
                        <div class="flex items-center justify-center gap-2">
                            <Button theme="icon" title="Editar">
                                <Icon icon="Pencil" width="16" height="16" />
                            </Button>
                            <Button theme="icon" title="Cambiar contraseña">
                                <Icon icon="Key" width="16" height="16" />
                            </Button>
                            <Button theme="icon" color="danger" title="Eliminar">
                                <Icon icon="Trash" width="16" height="16" />
                            </Button>
                        </div>
                    </Column>
                </Row>
            </template>

            <template #pagination>
           
                <Pagination :pagination="module.pagination" />
               
            </template>
        </Table>
        

    </div>
</template>

<script setup lang="ts">

const http = useHttp()
const route = useRoute()
const router = useRouter()

const module = ref(null)

const inputs = reactive({
    search: ''
})

const load = async () => {
   
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/users',
        params: {
            page: route.query?.page || 1,
            limit: 10
        }
    })

    if(!success) return 

    module.value = response

}


watch(() => route.query, () => {
    load()
})


onMounted(() => {
    load()
})
</script>
