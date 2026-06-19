import { ref, watch } from 'vue'
import { defineStore } from 'pinia'


interface OptionMeta {
    key: string
    source: string
}

export const useOptionsStore = defineStore('options', () => {

    const { request: http } = useHttp()

    const data = ref<Record<string, any[]>>({})

    const status = ref<Record<string, string>>({})

    const meta = ref<Record<string, OptionMeta>>({})

    const add = ({ key, source }: { key: string, source: string }) => {

        if(meta.value[key]) {
            return 
        }

        data.value[key] = []
        
        meta.value[key] = {
            key,
            source
        }

        status.value[key] = 'ready'

    }

    const set = ({key, dataset}: { key: string, dataset: any[] }) => {
        data.value[key] = dataset
    }

    const fetch = async () => {

        const promises = Object.keys(meta.value).map(async (key) => {

            const item = meta.value[key]

            if(status.value[key] !== 'ready') {
                return
            }

            try {

                status.value[key] = 'fetching'

                const { response } = await http({
                    url: item.source
                })

                status.value[key] = 'finished'

                data.value[key] = response

            } catch (error) {

                status.value[key] = 'error'
                data.value[key] = []
               
                return error
            }
        })
    
        await Promise.allSettled(promises)

    }

    const refresh = (key: string) => {

        if(!status.value[key] ) {
            return
        }

        status.value[key] = 'ready'

        fetch()

    }

    watch(meta.value, (next, prev) => {
        fetch()
    })
    
    return { data, add, set, refresh }

})