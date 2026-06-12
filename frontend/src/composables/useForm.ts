import { ref, reactive } from "vue"
import type { AxiosRequestConfig } from 'axios'

export const useForm = (item: Record<string, any> = {}) => {

    const { loading, request } = useHttp()

    const original = JSON.parse(JSON.stringify(item))

    const form = reactive(
        JSON.parse(JSON.stringify(item))
    )

    const errors = ref<Record<string, any>>({})

    const reset = () => {

        errors.value = {}

        Object.keys(original).forEach(e => {
            form[e] = JSON.parse(
                JSON.stringify(original[e])
            )
        })
        
    }
    
    const fill = (element: Record<string, any>) => {

        const base = JSON.parse(JSON.stringify(original))
        
        errors.value = {}

        element = JSON.parse(JSON.stringify(element))

        Object.keys(form).forEach(e => {

            if (element[e] === undefined || element[e] === null) {
                
                form[e] = JSON.parse(
                    JSON.stringify(base[e])
                )

                return
            }

            form[e] = JSON.parse(
                JSON.stringify(element[e])
            )

        })

    }

    const submit = async (config: AxiosRequestConfig = {}) => {

        errors.value = {}
        config.data = form

        const { response, status, success, message } = await request(config)

        if (status == 422 ) {
            response.errors.forEach(error => {
                errors.value[
                    error.context.label
                ] = error.message
            
            })
        }

        return {response, status, success, message}

    }

    return {
        form,
        loading,
        errors,
        submit,
        reset,
        fill
    }
    
}

export default useForm
