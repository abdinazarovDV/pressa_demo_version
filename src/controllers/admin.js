import order from 'orderby-time';
import { ERRORS } from "#lib/error"
const { ClientError } = ERRORS;

export const adminController = {
    
    GET: function(req, res, next) {
        try {
            let { sortby } = req.query;
            let data = req.jsonReadFile("posts");
            data = data.filter(post => {
                if(
                    (Date.parse(post.fullTime) >= Date.now()) && 
                    (post.check == false)
                    ) {
                        return post;
                    }
            });
            if(sortby == 'willTime') {
                console.log("will");
                data = order("fullTime", data);
                return res.status(200).json(data);

            }
            data = order("cameTime", data);
            return res.status(200).json(data);;
        } catch (err) {
            return next(err);
        }
    },

    PUT: function(req, res, next) {
        try {
            let { postId, agree } = req.body;
            console.log(false, agree);
            if(!postId || !([true, false].includes(agree))) throw new ClientError(400, "No postId or agree");
            let data = req.jsonReadFile("posts");
            let date = new Date;
            let time = date.getFullYear() + "-" +
                        (date.getMonth() + 1).toString().padStart(2, '0') + "-" +
                        (date.getDate() ).toString().padStart(2, '0') + "T" +
                        (date.getHours()).toString().padStart(2, '0') + ":" +
                        (date.getMinutes()).toString().padStart(2, '0') + ":00";

            data.forEach( post => {
                if(post.postId == postId) {
                    post.check = true;
                    post.refused = {
                        time,
                        agree
                    }
                }
            })
            console.log(data);
            req.jsonWriteFile("posts", data);
            return res.json({
                status: 200,
                message: "the user succsecfully updated"
            })
        } catch (err) {
            return next(err);
        }
    },

    GET_ACCEPTED: function (req, res, next) {
        try {
            let data = req.jsonReadFile("posts");
            data = order("refused.time", data);
            data = data.filter(post => {
                if(
                    (Date.parse(post.refused.time) >= Date.now()) && 
                    (post.refused.agree == true)
                ) {
                    return post;
                }
            });
            return res.status(200).json(data);
        } catch (err) {
            return next(err);
        }
    },

    GET_REJECTED: function (req, res, next) {
        try {
            let data = req.jsonReadFile("posts");
            data = order("refused.time", data);
            data = data.filter(post => {
                if(
                    (Date.parse(post.refused.time) >= Date.now()) && 
                    (post.refused.agree == false)
                ) {
                    return post;
                }
            });
            return res.status(200).json(data);
        } catch (err) {
            return next(err);
        }
    }
}