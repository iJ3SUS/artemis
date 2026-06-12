class SafeExecutor {

    static async execute(fn, ...args) {
        try {
            return await fn(...args)
        } catch (error) {
            console.error(`[SafeExecutor] Error executing ${fn.name || 'anonymous function'}:`, error)
            return null
        }
    }

    static wrap(fn) {
        return async (...args) => {
            return this.execute(fn, ...args)
        }
    }

}

export const safe = SafeExecutor
