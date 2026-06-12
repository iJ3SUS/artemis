import Model from "lemon-api/plugins/mongodb/model"
import { ObjectId } from "lemon-api/plugins/mongodb"

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import config from '#plugins/config.js'

import Role from '#app/roles/models/role.js'

export default class User extends Model {

    static collection = 'users'

    static hidden = [
        'password', 'hash'
    ]

    constructor(attributes = {}) {
        super(attributes)
    }
    
    randomHash(){
        return new ObjectId().toHexString()
    }

    can(permission) {
        return this.permissions?.includes(permission) || false
    }

}