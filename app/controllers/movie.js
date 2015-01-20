var Movie = require('../models/movie')
var Comment = require('../models/comment')
var _ = require('underscore')

//detail page
exports.detail = function (req, res) {
    var id = req.params.id
    Movie.findById(id, function (err, movie) {
        Comment
            .find({movie: id})
            .sort('meta.createAt')
            .populate('from', 'name')
            .populate('reply.from', 'name')
            .populate('reply.to', 'name')
            .exec(function (err, comments) {
            console.log(comments)
            res.render('movie/detail', {
                title: 'Imooc 详情页',
                movie: movie,
                comments: comments
            })
        })
    })
}
//admin page
exports.new = function (req, res) {
    res.render('movie/edit', {
        title: 'Imooc 后台管理',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
}
// admin update movie
exports.update = function (req, res) {
    var id = req.params.id
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('movie/edit', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
}
// admin post movie
exports.save = function (req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if (id != 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) console.log(err)
            _movie = _.extend(movie, movieObj)
            _movie.save(function (er, movie) {
                if (err) console.log(err)
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        })
        _movie.save(function (err, movie) {
            if (err) console.log(err)
            res.redirect('/movie/' + movie._id)
        })
    }
}
//list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        res.render('movie/list', {
            title: 'Imooc 列表页',
            movies: movies
        })
    })
}
//list page delete
exports.del = function (req, res) {
    var id = req.body.id
    //var id = req.query.id url 参数用 query, 匹配参数 params, 其他body
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) console.log(err)
            res.json({success: 1})
        })
    } else {
        res.json({success: 0})
    }
}