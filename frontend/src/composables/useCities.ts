import { ref, computed } from 'vue'

export const useCities = () => {

    const loading = ref(false)

    const data = ref([])

    const load = async () => {

        if(loading.value) return

        loading.value = true

        console.log("CARGAD")

        const res = await fetch('/cities.json')

        const res_data = await res.json()

        data.value = res_data.map(city => {

            return { 
                country_code: "Co",
                country_name: "Colombia",
                state_code: city.departamento.codigo,
                state_name: city.departamento.nombre,
                city_code: city.codigo,
                city_name: city.nombre,
                label: city.nombre + ' - ' + city.departamento.nombre
            }

        }).sort((a, b) => a.city_name.localeCompare(b.city_name))

        loading.value = false

    }

    return { load, data }
}
