<template>
    <Card>
        <template #header>
            <div class="flex items-center justify-between">
                <span>Familiares</span>
                <Button color="primary" @handle="openCreate">
                    Agregar familiar
                </Button>
            </div>
        </template>
        <template #content />
        <template #footer>
            <div v-if="family.length" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-y border-gray-200">
                            <th class="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Nombres</th>
                            <th class="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Apellidos</th>
                            <th class="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Parentezco</th>
                            <th class="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Género</th>
                            <th class="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">F. nacimiento</th>
                            <th class="px-4 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider text-xs">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(member, index) in family" :key="member._id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'" class="border-b border-gray-100 transition-colors hover:bg-gray-100/70 last:border-b-0">
                            <td class="px-4 py-3.5 text-center text-gray-900 font-medium">{{ member.names }}</td>
                            <td class="px-4 py-3.5 text-center text-gray-900 font-medium">{{ member.surnames }}</td>
                            <td class="px-4 py-3.5 text-center text-gray-600">{{ getRelationshipLabel(member.relationship) }}</td>
                            <td class="px-4 py-3.5 text-center text-gray-600">{{ getGenderLabel(member.gender) }}</td>
                            <td class="px-4 py-3.5 text-center text-gray-600">{{ $ParseDate(member.birth_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</td>
                            <td class="px-4 py-3.5 text-center">
                                <div class="flex justify-center gap-1">
                                    <Button theme="icon" v-tooltip:left="'Editar'" @handle="openEdit(member)">
                                        <Icon icon="Pencil" width="16" height="16" class="text-inherit" />
                                    </Button>
                                    <Button theme="icon" v-tooltip:left="'Eliminar'" @handle="removeMember(member._id)">
                                        <Icon icon="Trash" width="16" height="16" class="text-inherit" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="text-sm text-gray-400 px-4 py-6 text-center">No hay familiares registrados</p>
        </template>
    </Card>

    <FamilyModal :show="showModal" :member="editing" :employee-id="employee._id" @close="closeModal" @success="onSaved" />
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import FamilyModal from '../components/FamilyModal.vue'

const props = defineProps<{
    employee: Record<string, any>
}>()

const http = useHttp()

const showModal = ref(false)
const editing = ref<Record<string, any> | null>(null)
const family = ref<any[]>([])

const getRelationshipLabel = (value: string) => {
    const labels: Record<string, string> = { spouse: 'Esposo(a)', child: 'Hijo(a)', father: 'Padre', mother: 'Madre', sibling: 'Hermano(a)', grandparent: 'Abuelo(a)', other: 'Otro' }
    return labels[value] || '-'
}

const getGenderLabel = (value: string) => {
    const labels: Record<string, string> = { male: 'Masculino', female: 'Femenino', other: 'Otro' }
    return labels[value] || '-'
}

const loadFamily = async () => {
    const { success, response } = await http.request({
        method: 'GET',
        url: `dashboard/employees/${props.employee._id}/family`
    })

    if (!success) return

    family.value = response
}

const openCreate = () => {
    editing.value = null
    showModal.value = true
}

const openEdit = (member: Record<string, any>) => {
    editing.value = member
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editing.value = null
}

const onSaved = () => {
    closeModal()
    loadFamily()
}

const removeMember = async (id: string) => {
    const result = await Swal.fire({
        title: '¿Eliminar familiar?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc2626'
    })

    if (!result.isConfirmed) return

    const { success } = await http.request({
        method: 'DELETE',
        url: `dashboard/employees/${props.employee._id}/family/${id}`
    })

    if (!success) return

    loadFamily()
}

onMounted(() => {
    loadFamily()
})
</script>
