import jwt from 'jsonwebtoken';
import { configs } from "#config"

export default {
    sign: (payload) => jwt.sign(payload, configs.token_key),
    verify: (token) => jwt.verify(token, configs.token_key)
}