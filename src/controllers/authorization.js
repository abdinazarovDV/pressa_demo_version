import { ERRORS } from "#lib/error"
import Token from '#lib/jwt'
import sha256 from 'sha256'
const { ClientError } = ERRORS;

export const authController = {

    POST_LOGIN: function(req, res, next) {
        try {
            let { username, password } = req.body;
            if(!username) throw new ClientError(400, "No username");
            if(!password) throw new ClientError(400, "No password");

            let data = req.jsonReadFile("users");
            let find = data.find( user => user.username === username && user.password === sha256(password));
            if(!find) throw new ClientError(400, "Username or password invalid")

            let payload = {
                userId: find.userId,
                agent: req.headers['user-agent'],
            }
            let giveToken = Token.sign(payload);
            return res.status(200).json({
                token: giveToken
            })
        } catch (err) {
            return next(err);
        }
    }
}