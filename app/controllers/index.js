var Movie = require('../models/movie')
var Category = require('../models/category')
    //index page
exports.index = function(req, res) {
    //console.log('user in session:' + req.session.user)
    Category
        .find({})
        .populate({
            path: "movies",
            options: {
                limit: 5
            }
        })
        .exec(function(err, categories) {
            res.render('index', {
                title: 'Imooc 首页',
                categories: categories
            })
        })
}
