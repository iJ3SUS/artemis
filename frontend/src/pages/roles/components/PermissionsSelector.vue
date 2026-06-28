<template>
    <Card>
        <template #header>
            <div class="flex items-center justify-between w-full">
                <span>Permisos</span>
                <span class="text-xs font-normal text-gray-500">
                    {{ totalSelected }} / {{ totalPermissions }} seleccionados
                </span>
            </div>
        </template>

        <template #content>
            <div v-if="loading" class="text-sm text-gray-500 py-8 text-center">
                <div class="animate-pulse">Cargando permisos...</div>
            </div>

            <template v-else>
                <div class="pb-4">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Buscar permiso..."
                        class="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded shadow-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
                    />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                        v-for="(group, module) in filteredGroups"
                        :key="module"
                        class="border border-gray-200 rounded overflow-hidden"
                    >
                        <div
                            class="flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-800 border-b border-gray-200"
                        >
                            <div class="flex items-center gap-2">
                                <div
                                    class="w-2 h-2 rounded-full"
                                    :class="moduleColors[module]?.dot || 'bg-gray-400'"
                                />
                                {{ moduleLabels[module] || module }}
                                <span class="text-xs font-normal text-gray-400">({{ selectedCount(module) }}/{{ group.length }})</span>
                            </div>
                            <button
                                type="button"
                                class="text-xs transition-colors px-2 py-0.5 rounded-full border"
                                :class="isModuleFullySelected(group)
                                    ? 'border-red-200 text-red-600 hover:bg-red-50 bg-red-50/50'
                                    : 'border-blue-200 text-blue-600 hover:bg-blue-50 bg-blue-50/50'"
                                @click="toggleModule(module, group)"
                            >
                                {{ isModuleFullySelected(group) ? 'Quitar todos' : 'Todos' }}
                            </button>
                        </div>

                        <div class="divide-y divide-gray-100">
                            <label
                                v-for="perm in group"
                                :key="perm._id"
                                class="flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition-colors"
                                :class="selected.includes(perm._id)
                                    ? 'bg-blue-50/60'
                                    : 'hover:bg-gray-50'"
                            >
                                <input
                                    type="checkbox"
                                    :value="perm._id"
                                    :checked="selected.includes(perm._id)"
                                    class="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0"
                                    @change="toggle(perm._id)"
                                />
                                <div class="min-w-0">
                                    <div
                                        class="text-sm leading-snug"
                                        :class="selected.includes(perm._id) ? 'text-blue-800 font-medium' : 'text-gray-700'"
                                    >{{ perm.name }}</div>
                                    <div v-if="perm.description" class="text-xs text-gray-400 mt-0.5 leading-relaxed">{{ perm.description }}</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div v-if="Object.keys(filteredGroups).length === 0" class="text-sm text-gray-500 py-8 text-center">
                    No hay permisos que coincidan con "{{ search }}"
                </div>
            </template>
        </template>
    </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string[]
}>()

const emit = defineEmits<{
    'update:modelValue': [_ids: string[]]
}>()

const moduleLabels: Record<string, string> = {
    'users': 'Usuarios',
    'roles': 'Roles',
    'job-titles': 'Cargos',
    'employees': 'Empleados',
    'charts': 'Gráficos',
}

const moduleColors: Record<string, { bg: string; dot: string }> = {
    'users': { bg: 'bg-blue-50', dot: 'bg-blue-500' },
    'roles': { bg: 'bg-purple-50', dot: 'bg-purple-500' },
    'job-titles': { bg: 'bg-amber-50', dot: 'bg-amber-500' },
    'employees': { bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    'charts': { bg: 'bg-rose-50', dot: 'bg-rose-500' },
}

const http = useHttp()
const loading = ref(true)
const permissions = ref<any[]>([])
const search = ref('')

const selected = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const totalPermissions = computed(() => permissions.value.length)

const totalSelected = computed(() => selected.value.length)

function selectedCount(module: string): number {
    const ids = grouped.value[module]?.map(p => p._id) || []
    return ids.filter(id => selected.value.includes(id)).length
}

const grouped = computed(() => {
    const groups: Record<string, any[]> = {}
    for (const p of permissions.value) {
        if (!groups[p.module]) groups[p.module] = []
        groups[p.module].push(p)
    }
    return groups
})

const filteredGroups = computed(() => {
    const q = search.value.toLowerCase().trim()
    if (!q) return grouped.value

    const result: Record<string, any[]> = {}
    for (const [module, perms] of Object.entries(grouped.value)) {
        const filtered = perms.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.key && p.key.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
        )
        if (filtered.length > 0) result[module] = filtered
    }
    return result
})

function isModuleFullySelected(group: any[]): boolean {
    return group.length > 0 && group.every(p => selected.value.includes(p._id))
}

function toggle(_id: string) {
    const current = [...selected.value]
    const idx = current.indexOf(_id)
    if (idx === -1) {
        current.push(_id)
    } else {
        current.splice(idx, 1)
    }
    emit('update:modelValue', current)
}

function toggleModule(module: string, group: any[]) {
    const ids = group.map(p => p._id)
    if (isModuleFullySelected(group)) {
        emit('update:modelValue', selected.value.filter(id => !ids.includes(id)))
    } else {
        const current = [...selected.value]
        for (const id of ids) {
            if (!current.includes(id)) current.push(id)
        }
        emit('update:modelValue', current)
    }
}

onMounted(async () => {
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/permissions/list',
    })
    if (success) {
        permissions.value = response
    }
    loading.value = false
})
</script>
