import bcrypt from 'bcrypt'

export default class Hash {

    static async encrypt(value) {
        return await bcrypt.hash(value, 10)
    }

    static async compare(string, hash) {
        return await bcrypt.compare(string, hash)
    }

}
