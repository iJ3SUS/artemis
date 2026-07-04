<template>
    <Card>
        <template #header>
            <div class="flex items-center justify-between">
                <span>Familiares</span>
                <Button color="primary" @handle="showModal = true">
                    Agregar familiar
                </Button>
            </div>
        </template>
        <template #content>
            <div v-if="family.length" class="space-y-4">
                <div v-for="(member, index) in family" :key="index"
                    class="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                    <div class="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                            <span class="text-xs font-medium text-gray-500 uppercase">Nombres</span>
                            <p class="text-gray-900">{{ member.names }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-gray-500 uppercase">Apellidos</span>
                            <p class="text-gray-900">{{ member.surnames }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-gray-500 uppercase">Parentezco</span>
                            <p class="text-gray-900">{{ getRelationshipLabel(member.relationship) }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-gray-500 uppercase">Género</span>
                            <p class="text-gray-900">{{ getGenderLabel(member.gender) }}</p>
                        </div>
                        <div>
                            <span class="text-xs font-medium text-gray-500 uppercase">F. nacimiento</span>
                            <p class="text-gray-900">{{ $ParseDate(member.birth_date)?.toFormat('dd/MM/yyyy') ?? '-' }}</p>
                        </div>
                    </div>
                    <button type="button"
                        class="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0 mt-1"
                        @click="removeMember(index)">
                        <Icon icon="Trash" width="14" height="14" class="text-inherit" />
                    </button>
                </div>
            </div>
            <p v-else class="text-sm text-gray-400">No hay familiares registrados</p>
        </template>
    </Card>

    <FamilyModal :show="showModal" @close="showModal = false" @save="addMember" />
</template>

<script setup lang="ts">
import FamilyModal from '../components/FamilyModal.vue'

defineProps<{
    employee: Record<string, any>
}>()

const showModal = ref(false)
const family = ref<any[]>([])

const getRelationshipLabel = (value: string) => {
    const labels: Record<string, string> = { spouse: 'Esposo(a)', child: 'Hijo(a)', father: 'Padre', mother: 'Madre', sibling: 'Hermano(a)', grandparent: 'Abuelo(a)', other: 'Otro' }
    return labels[value] || '-'
}

const getGenderLabel = (value: string) => {
    const labels: Record<string, string> = { male: 'Masculino', female: 'Femenino', other: 'Otro' }
    return labels[value] || '-'
}

const addMember = (member: Record<string, any>) => {
    family.value.push(member)
    showModal.value = false
}

const removeMember = (index: number) => {
    family.value.splice(index, 1)
}
</script>
