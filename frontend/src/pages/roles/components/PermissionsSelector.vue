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

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    v-for="(group, module) in grouped"
                    :key="module"
                    class="bg-surface border border-border rounded-xl overflow-hidden"
                >
                    <div
                        class="flex items-center justify-between px-4 py-2.5 border-b border-border"
                        :class="moduleColors[module]?.bg || 'bg-gray-50'"
                    >
                        <div class="flex items-center gap-2">
                            <div
                                class="w-2 h-2 rounded-full"
                                :class="moduleColors[module]?.dot || 'bg-gray-400'"
                            />
                            <h4 class="text-sm font-semibold text-gray-800">{{ moduleLabels[module] || module }}</h4>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-500">
                                {{ selectedCount(module) }}/{{ group.length }}
                            </span>
                            <button
                                type="button"
                                class="text-xs font-medium transition-colors px-2 py-0.5 rounded-full border"
                                :class="isModuleFullySelected(group)
                                    ? 'border-red-200 text-red-600 hover:bg-red-50 bg-red-50/50'
                                    : 'border-primary-200 text-primary-600 hover:bg-primary-50 bg-primary-50/50'"
                                @click="toggleModule(module, group)"
                            >
                                {{ isModuleFullySelected(group) ? 'Quitar todos' : 'Todos' }}
                            </button>
                        </div>
                    </div>

                    <div class="px-3 py-2.5 space-y-0.5">
                        <label
                            v-for="perm in group"
                            :key="perm._id"
                            class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                            :class="selected.includes(perm._id)
                                ? 'bg-primary-50/60'
                                : 'hover:bg-gray-50'"
                        >
                            <input
                                type="checkbox"
                                :value="perm._id"
                                :checked="selected.includes(perm._id)"
                                class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-0 cursor-pointer"
                                @change="toggle(perm._id)"
                            />
                            <div class="flex-1 min-w-0">
                                <span
                                    class="text-sm block truncate"
                                    :class="selected.includes(perm._id) ? 'text-primary-800 font-medium' : 'text-gray-700'"
                                >{{ perm.name }}</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
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
