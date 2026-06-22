import 'dotenv/config'

const createConfig = () => {

    const app_folder = process.cwd()

    return {

        app: {
            folder: app_folder
        },

        db: {
            host: process.env.MONGODB_URI,
            name: process.env.MONGODB_NAME
        },

        server: {
            port: process.env.SERVER_PORT,
            host: process.env.SERVER_HOST
        },

        jwt: {
            secret: process.env.JWT_SECRET
        },

        timezone: process.env.TIMEZONE || 'America/Bogota',

        meta: {
            verify_token: process.env.META_VERIFY_TOKEN,
            app_secret: process.env.META_APP_SECRET,
            system_token: process.env.META_SYSTEM_TOKEN
        }

    }
    
}

const config = createConfig()

export default config
export { config }