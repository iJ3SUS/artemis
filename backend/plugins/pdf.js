import wkhtmltopdf from 'wkhtmltopdf'
import os from 'os'

export default class Pdf {

    static binaryPath = null

    static setBinaryPath(path) {
        Pdf.binaryPath = path
        wkhtmltopdf.command = path
        return Pdf
    }

    static init() {
        if (Pdf.binaryPath) {
            wkhtmltopdf.command = Pdf.binaryPath
            return
        }

        const platform = os.platform()
        if (platform === 'win32') {
            wkhtmltopdf.command = 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe'
        }
    }

    constructor() {
        this.html = null
        this.opts = {}
    }

    fromHtml(html) {
        this.html = html
        return this
    }

    fromFile(filePath) {
        import('fs').then(fs => {
            this.html = fs.readFileSync(filePath, 'utf8')
        })
        return this
    }

    options(opts = {}) {
        this.opts = { ...this.opts, ...opts }
        return this
    }

    generate() {
        return new Promise((resolve, reject) => {
            if (!this.html) {
                return reject(new Error('HTML content is required'))
            }

            Pdf.init()

            const stream = wkhtmltopdf(this.html, this.opts)

            const chunks = []
            stream.on('data', (chunk) => chunks.push(chunk))
            stream.on('end', () => {
                const buffer = Buffer.concat(chunks)
                resolve(buffer)
            })
            stream.on('error', (err) => reject(err))
        })
    }

}
