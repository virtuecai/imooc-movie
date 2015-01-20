var Movie = require('../models/movie')
//index page
exports.index = function (req, res) {
    //console.log('user in session:' + req.session.user)
    Movie.fetch(function (err, movies) {
        res.render('index', {
            title: 'Imooc 首页',
            movies: movies
        })
    })
}