<template>
    <Page>
        <template #heading>
            <Heading>
                <template #title>
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <p class="text-sm text-gray-500 mt-0.5">Demografía de los empleados</p>
                    </div>
                </template>
            </Heading>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card v-if="gender_data">
                <template #header>
                    Distribución por género
                </template>
                <template #content>
                    <div class="h-64">
                        <Pie :data="gender_chart_data" :options="pie_options" />
                    </div>
                </template>
            </Card>

            <Card v-if="age_data">
                <template #header>
                    Distribución por rango de edad
                </template>
                <template #content>
                    <div class="h-64">
                        <Bar :data="age_chart_data" :options="bar_options" />
                    </div>
                </template>
            </Card>

            <Card v-if="stratum_data">
                <template #header>
                    Nivel socioeconómico (estrato)
                </template>
                <template #content>
                    <div class="h-64">
                        <Bar :data="stratum_chart_data" :options="bar_options" />
                    </div>
                </template>
            </Card>

            <Card v-if="job_title_data">
                <template #header>
                    Empleados por cargo
                </template>
                <template #content>
                    <div :style="{ height: job_title_chart_height + 'px' }">
                        <Bar :data="job_title_chart_data" :options="horizontal_bar_options" />
                    </div>
                </template>
            </Card>

            <Card v-if="city_data">
                <template #header>
                    Lugar de residencia
                </template>
                <template #content>
                    <div :style="{ height: city_chart_height + 'px' }">
                        <Bar :data="city_chart_data" :options="horizontal_bar_options" />
                    </div>
                </template>
            </Card>
        </div>
    </Page>
</template>

<script setup lang="ts">
import { Pie, Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const http = useHttp()

const gender_data = ref(null)
const age_data = ref(null)
const stratum_data = ref(null)
const job_title_data = ref(null)
const city_data = ref(null)

const pie_options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const }
    }
}

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

const horizontal_bar_options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } }
    }
}

const gender_labels = { male: 'Masculino', female: 'Femenino', other: 'Otro' }
const gender_colors = { male: '#3B82F6', female: '#EC4899', other: '#6B7280' }

const gender_chart_data = computed(() => {
    if (!gender_data.value) return null
    const items = gender_data.value
    return {
        labels: items.map((i: any) => gender_labels[i.gender] || i.gender),
        datasets: [{
            data: items.map((i: any) => i.count),
            backgroundColor: items.map((i: any) => gender_colors[i.gender] || '#9CA3AF')
        }]
    }
})

const age_chart_data = computed(() => {
    if (!age_data.value) return null
    return {
        labels: age_data.value.map((i: any) => i.range),
        datasets: [{
            data: age_data.value.map((i: any) => i.count),
            backgroundColor: '#6366F1'
        }]
    }
})

const stratum_labels: Record<number, string> = { 1: 'Estrato 1', 2: 'Estrato 2', 3: 'Estrato 3', 4: 'Estrato 4', 5: 'Estrato 5' }

const stratum_chart_data = computed(() => {
    if (!stratum_data.value) return null
    return {
        labels: stratum_data.value.map((i: any) => stratum_labels[i.stratum] || `Estrato ${i.stratum}`),
        datasets: [{
            data: stratum_data.value.map((i: any) => i.count),
            backgroundColor: '#10B981'
        }]
    }
})

const job_title_chart_height = computed(() => {
    if (!job_title_data.value) return 256
    return Math.max(256, job_title_data.value.length * 28)
})

const job_title_chart_data = computed(() => {
    if (!job_title_data.value) return null
    return {
        labels: job_title_data.value.map((i: any) => i.name || 'Sin cargo'),
        datasets: [{
            data: job_title_data.value.map((i: any) => i.count),
            backgroundColor: '#8B5CF6'
        }]
    }
})

const city_chart_height = computed(() => {
    if (!city_data.value) return 256
    return Math.max(256, city_data.value.length * 28)
})

const city_chart_data = computed(() => {
    if (!city_data.value) return null
    return {
        labels: city_data.value.map((i: any) => i.city_name),
        datasets: [{
            data: city_data.value.map((i: any) => i.count),
            backgroundColor: '#F59E0B'
        }]
    }
})

const fetchDemographics = async (url: string) => {
    const { success, response } = await http.request({
        method: 'GET',
        url
    })
    return success ? response : null
}

onMounted(async () => {
    const [gender, age, stratum, job_title, city] = await Promise.all([
        fetchDemographics('dashboard/charts/employees/gender'),
        fetchDemographics('dashboard/charts/employees/age-range'),
        fetchDemographics('dashboard/charts/employees/stratum'),
        fetchDemographics('dashboard/charts/employees/job-title'),
        fetchDemographics('dashboard/charts/employees/city'),
    ])

    gender_data.value = gender
    age_data.value = age
    stratum_data.value = stratum
    job_title_data.value = job_title
    city_data.value = city
})
</script>
