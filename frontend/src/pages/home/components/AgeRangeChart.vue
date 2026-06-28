<template>
    <Card>
        <template #header>
            Distribución por rango de edad
        </template>
        <template #content>
            <div v-if="data" class="h-64">
                <Bar :data="chart_data" :options="bar_options" />
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Chart as ChartJS } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const http = useHttp()

const data = ref(null)

const bar_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } }
    }
}

const chart_data = computed(() => {
    if (!data.value) return null
    return {
        labels: data.value.map((i: any) => i.range),
        datasets: [{
            data: data.value.map((i: any) => i.count),
            backgroundColor: '#6366F1'
        }]
    }
})

onMounted(async () => {
    const { success, response } = await http.request({
        method: 'GET',
        url: 'dashboard/charts/employees/age-range'
    })
    if (success) data.value = response
})
</script>
