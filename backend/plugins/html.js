import ejs from 'ejs'
import path from 'path'
import { DateTime } from 'luxon'
import config from '#plugins/config.js'

export default class Html {

    constructor() {
        this.template = null
        this.type = 'file'
    }

    from(template) {
        this.template = template
        return this
    }

    options({ type = 'file' } = {}) {
        this.type = type
        return this
    }

    render(data = {}) {
        const helpers = {
            ParseDate: (date) => {
                if (date instanceof Date) {
                    return DateTime.fromJSDate(date).setZone('America/Bogota')
                }
                return DateTime.fromISO(date, { zone: 'utc' }).setZone('America/Bogota')
            }
        }

        const mergedData = { config, ...helpers, ...data }

        if (this.type === 'file') {
            const fullPath = path.isAbsolute(this.template) 
                ? this.template 
                : path.join(config.app.folder, this.template)

            return new Promise((resolve, reject) => {
                ejs.renderFile(fullPath, mergedData, (err, html) => {
                    if (err) return reject(err)
                    resolve(html)
                })
            })
        }

        return new Promise((resolve, reject) => {
            ejs.render(this.template, mergedData, (err, html) => {
                if (err) return reject(err)
                resolve(html)
            })
        })
    }

}
