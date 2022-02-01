// import order from 'orderby-time';

export const adminController = {
    
    GET: function(req, res, next) {
        try {
            console.log("getcontroller");
            let data = req.jsonReadFile("posts");
            data = data.filter( post => {
                if(post.check == false){
                    return true;
                }
            })

            return res.json(data);
        } catch (err) {
            return next(err);
        }
    },

    PUT: function(req, res, next) {
        try {
            let { postId, agree } = req.body;
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

            req.jsonWriteFile("posts", data);
            return res.json({
                status: 200,
                message: "the user succsecfully updated"
            })
        } catch (err) {
            return next(err);
        }
    },

    DELDONE: function (req, res, next) {
        try {
            let data = req.jsonReadFile("posts");
            let dataCopy = req.jsonReadFile("posts");
            data = data.filter(el=>Date.parse(el.fullTime)>=Date.now());
            let arrIdFuture = data.map( el => el.postId);
            let index = dataCopy.findIndex( el => !arrIdFuture.includes(el.postId));
            req.jsonWriteFile("removed", dataCopy[index]);
            dataCopy.splice(index, 1);
            req.jsonWriteFile("posts", dataCopy);
            return res.status(200).json({
                status: 200,
                message: "removed"
            })
        } catch (err) {
            return next(err);
        }
    }
}