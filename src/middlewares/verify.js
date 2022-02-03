import { ERRORS } from "#lib/error"
const { ClientError } = ERRORS;
import Token from '#lib/jwt'

export default function (req, res, next) {
    try {
        const { token } = req.headers;
        console.log(req.headers);
        if(!token) throw new ClientError(401, "No token");
        const { userId, agent } = Token.verify(token);
        if(!(req.headers['user-agent'] == agent)) throw new ClientError(401, "token is invalid!")
        req.userId = userId;
        return next();
    } catch (err) {
        return next(err);
    }
}