import { ERRORS } from "#lib/error"
const { ClientError } = ERRORS;


function self(query) {
    if(query)
        return JSON.parse(query);
    return query;
}

export default function (req, res, next) {
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

        if(!date) throw new ClientError(400, 'No date');
        if(!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).test(date))
            throw new ClientError(400, 'Invalid date');

        if(!time) throw new ClientError(400, 'No time');
        if(!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).test(time))
            throw new ClientError(400, 'Invalid time')

        if(!mainCategory) throw new ClientError(400, 'No main category');
        let check = data.find( cat => Object.keys(cat)[0] == mainCategory);
        if(!check) throw new ClientError(400, 'No like this main category');
        
        if(!([1, 2]).includes(+type)) throw new ClientError(400, 'Please enter online or offline format');
        if(!link) throw new ClientError(400, 'No link');
        if(!([1, 2]).includes(+organizer)) throw new ClientError(400, 'No organizer');
        if(organizer == 2 && !legalName) throw new ClientError(400, ' no legalName');
        if(!speaker || speaker.length < 2) throw new ClientError(400, 'No speaker');
        if(!proffesion) throw new ClientError(400, 'No speaker\'s proffesion');
        if(!phone || JSON.parse(phone).length !=2) throw new ClientError(400, 'No enough phone numbers');
        if(!title) throw new ClientError(400, 'No title');
        if(!description) throw new ClientError(400, 'No description');
        if(!text) throw new ClientError(400, 'No text');
        


        let data = req.jsonReadFile('categories');


        //validation subCategory
        data.forEach( cat => {
            if(cat[mainCategory])
                if(!(cat[mainCategory]).includes(subCategory))
                    throw new ClientError(400, 'No like this sub category');
        })

        // validation uz_phoneNumbers
        for(let i=0; i<2; i++){
            if(!(/^998(9[012345789]|3[3]|7[1]|8[8])[0-9]{7}$/).test([self(phone)[i]]))
                throw new ClientError(400, 'invalid phone number');
        }

        if(title.length > 55 || title.length < 8)
            throw new ClientError(400, 'title length must be beetwen 8 and 55');
        if(description.length < 30 || description.length > 300)
            throw new ClientError(400, 'description length must be beetwen 30 and 300');
        if(text.length < 100 || text.length > 1000 )
            throw new ClientError(400, 'text length must be beetwen 100 and 1000');

        //validation image
        let { files } = req.files || {files: "" }
        if(!files) throw new ClientError(400, 'No image');
        if(!(['jpg', 'jpeg', 'png']).includes(files.mimetype.split('/')[1]))
            throw new ClientError(400, 'Must be jpg, jpeg, png format');
        if(files.size > (3 * (2**20))) throw new ClientError(400, 'Image must be least than 3 mg!')

        return next();
    } catch (err) {
        return next(err);
    }
}