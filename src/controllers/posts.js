import path from 'path';
import order from 'orderby-time';
import { ERRORS } from "#lib/error";
const { ClientError } = ERRORS;
export const postsController = {

    POST: function (req, res, next) {
        try {
            let {
                date,
                time,
                mainCategory,
                subCategory,
                type,
                link,
                organizer,
                legalName = "",
                speaker,
                proffesion,
                phone,
                title,
                description,
                text
            } = req.body;

            let { files } = req.files;
            const filename = (Date.now() % (10**9)) + files.name.replace(/\s/g, '');
            const address = path.join(process.cwd(), 'media', 'img', filename);
            let data = req.jsonReadFile("posts");
            files.mv(address);

            let newPost = {
                postId: data[data.length - 1].postId + 1,
                date,
                time,
                fullTime: date + 'T' + time + ":00",
                cameTime: new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0],
                mainCategory,
                subCategory,
                type,
                link,
                organizer,
                speaker,
                proffesion,
                phone: JSON.parse(phone),
                title,
                description,
                image: "/getting/img/" + filename,
                text,
                check: false,
                views: 0
            }
            if(organizer == 2){
                newPost.legalName = legalName;
            }

            data.push(newPost);
            req.jsonWriteFile("posts", data);

            res.status(200).json({
                status: 200,
                message: "post sended to admin!"
            });

        } catch(err) {
            return next(err);
        }
    },

    GET: function(req, res, next) {
        try {
            let data = req.jsonReadFile('posts');
            data = data.filter( el => el.check == true && el.refused.agree == true);
            data = order('fullTime',data);
            let {
                date = "",
                type = "",
                search = "",
                mainCategory = "",
                subCategory = "",
                speaker = "",

            } = req.query;
            console.log(data);
            let newBase = data.filter(el=>Date.parse(el.fullTime)>=Date.now());
            if(date) newBase = newBase.filter(el=>el.date==req.query.date);

            if(type) newBase = newBase.filter(el=>el.type==req.query.type);

            if(search) newBase = newBase.filter(el=>el.title.toLowerCase().includes(req.query.search.toLocaleLowerCase()));

            if(mainCategory) newBase = newBase.filter(el=>el.mainCategory.toLowerCase()==req.query.mainCategory.toLowerCase());

            if(subCategory && JSON.parse(subCategory)){
                subCategory = JSON.parse(subCategory).map( el => el.toLowerCase());
                newBase = newBase.filter(el=>subCategory.includes(el.subCategory.toLowerCase()));
            }
            if(speaker) newBase = newBase.filter(el=>el.speaker.toLowerCase().includes(req.query.speaker.toLocaleLowerCase()));

            const { 
                page = 1, 
                limit = 9 
            } = req.query;

            newBase = newBase.filter(el=> {
                delete el.fullTime;
                el.refusedTime = el.refused.time;
                delete el.refused;
                return el
            })

            newBase = newBase.slice(page*limit-limit,page*limit);
            
            res.json(newBase);

        } catch(err) {
            return next(err);
        }
        
    },

    GETWITHID: function(req, res, next) {
        try {
            let { postId } = req.params;
            let data = req.jsonReadFile("posts");
            let dataCopy = req.jsonReadFile("posts");
            data = data.filter( post => post.postId == postId);
            if(data.length == 0) throw new ClientError(400, "No like this id");
            
            data.map( post => {
                delete post.fullTime;
                post.refusedDate = post.refused.time.split("T")[0];
                post.refusedTime = post.refused.time.split("T")[1].slice(0,5);
                delete post.refused;
            })

            dataCopy.map( post => post.views += 1);
            req.jsonWriteFile("posts", dataCopy);
            
            return res.status(200).json(data);
        } catch(err) {
            return next(err);
        }
    },

    GETSPEAKERS: function(req, res, next) {
        try{
            let data = req.jsonReadFile("posts");
            data = data.map( post => post.speaker);
            data = new Set(data);
            data = Array.from(data);
            return res.status(200).json(data);
        } catch (err) {
            return next(err);
        }
    }
}