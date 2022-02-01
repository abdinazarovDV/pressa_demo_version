export const categoryController = {

    GET: function(req, res, next) {
        try{
            let data = req.jsonReadFile("categories");
            res.status(200).json({
                status: 200,
                message: data
            });
        } catch {}

    }
}