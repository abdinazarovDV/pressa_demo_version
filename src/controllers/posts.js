import path from 'path';
import order from 'orderby-time';
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
            let text = req.jsonReadFile('posts');
            text = text.filter( el => el.check == true && el.refused.agree == true);
            text = order('fullTime',text);
            let {
                date = "",
                type = "",
                search = "",
                mainCategory = "",
                subCategory = "",
                speaker = "",

            } = req.query;

            let newBase = text.filter(el=>Date.parse(el.fullTime)>=Date.now());
            
            if(date){
                newBase = newBase.filter(el=>el.date==req.query.date);
            }

            if(type){
                newBase = newBase.filter(el=>el.type==req.query.type);
            }

            if(search){
                newBase = newBase.filter(el=>el.title.toLowerCase().includes(req.query.search.toLocaleLowerCase()));
            }

            if(mainCategory){
                newBase = newBase.filter(el=>el.mainCategory.toLowerCase()==req.query.mainCategory.toLocaleLowerCase());
            }
            if(JSON.parse(subCategory)){
                subCategory = JSON.parse(subCategory);
                console.log(subCategory.includes("web-dasturlash"));
                newBase = newBase.filter(el=>subCategory.includes(el.subCategory));
            }

            if(speaker){
                newBase = newBase.filter(el=>el.speaker.toLowerCase().includes(req.query.speaker.toLocaleLowerCase()));
            }

            const { 
                page = 1, 
                limit = 9 
            } = req.query;
            newBase = newBase.filter(el=> {
                delete el.fullTime
                return el
            })

            newBase = newBase.slice(page*limit-limit,page*limit);
            
            res.json(newBase);
        } catch(err) {
            return next(err);
        }
        
    },

    PUT: function(req, res, next) {
        try {
            let { postId } = req.body;
            let data = req.jsonReadFile("posts");
            data.map( post => {
                if(post.postId == postId){
                    post.views += 1;
                }
            })
            req.jsonWriteFile("posts", data);
            res.status(200).json({
                status: 200,
                message: "views added!"
            })
        } catch(err) {
            return next(err);
        }
    }
}