<template>
    <Card v-if="data">
        <template #header>
            Distribución por género
        </template>
        <template #content>
            <div class="h-64">
                <Pie :data="chart_data" :options="pie_options" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { ArcElement, Tooltip, Legend } from 'chart.js'
import { Chart as ChartJS } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const http = useHttp()

const data = ref(null)

const gender_labels: Record<string, string> = { male: 'Masculino', female: 'Femenino', other: 'Otro' }
const gender_colors: Record<string, string> = { male: '#3B82F6', female: '#EC4899', other: '#6B7280' }

const pie_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const }
    }
}

const chart_data = computed(() => {
    if (!data.value) return null
    const items = data.value
    return {
        labels: items.map((i: any) => gender_labels[i.gender] || i.gender),
        datasets: [{
            data: items.map((i: any) => i.count),
            backgroundColor: items.map((i: any) => gender_colors[i.gender] || '#9CA3AF')
        }]
    }
})

onMounted(async () => {
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/charts/employees/gender'
    })
    if (success) data.value = response
})
</script>
