var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');

var port = process.env.PORT || 3000; //cmd: PORT=4000 node app.js
var app = express();

// Models
var Movie = require('./models/movie');
var User = require('./models/user')

// DB cfg
//mongoose.connect('mongodb://localhost/movie');
mongoose.connect('mongodb://root:root@localhost:27017/movie');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error ...'));
db.once('open', function callback() {
    console.info("mongodb opened ...");
});

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(cookieParser());
//保持会话
app.use(session({
    secret: 'imooc'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('movie started on port ' + port);

//index page
app.get('/', function (req, res) {
    console.log('user in session:')
    console.log(req.session.user);
    Movie.fetch(function (err, movies) {
        res.render('index', {
            title: 'Imooc 首页',
            movies: movies
        })
    });
});

// signup 注册
app.post('/user/signup', function (req, res) {
    //res.param("key"), 源码: node_modules\express\lib\request.js, line: 203
    var _user = req.body.user;
    var user = new User(_user);
    User.find({name: _user.name}, function (err, user) {
        if (err) console.log(err);
        if (user) {
            res.redirect('/');
        } else {
            user.save(function (err, user) {
                if (err) console.log(err);
                res.redirect('/admin/userlist');
            });
        }
    });
});
// signin 登录
app.post('/user/signin', function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: _user.name}, function (err, user) {
        if (err) console.log(err+"");
        if (!user) {
            console.log('Password is not matched!')
            return res.redirect('/');
        }
        //得密码加密处理. 暂无实现
        user.comparePassword(password, function (err, isMatch) {
            if (err) console.log(err);
            if (isMatch) {
                console.log('Password is matched!');
                req.session.user = user;
                return res.redirect('/');
            }
            else console.log('Password is not matched!');
        });
    });
});
//list page
app.get('/admin/userlist', function (req, res) {
    User.fetch(function (err, users) {
        res.render('userlist', {
            title: 'Imooc 用户列表页',
            users: users
        })
    });
});


//detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'Imooc 详情页',
            movie: movie
        })
    });
});
//admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
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
    });
});
// admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
});
// admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if (id != 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) console.log(err);
            _movie = _.extend(movie, movieObj);
            _movie.save(function (er, movie) {
                if (err) console.log(err);
                res.redirect('/movie/' + movie._id);
            });
        });
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
        });
        _movie.save(function (err, movie) {
            if (err) console.log(err)
            res.redirect('/movie/' + movie._id);
        });
    }
});
//list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        res.render('list', {
            title: 'Imooc 列表页',
            movies: movies
        })
    });
});
//list page delete
app.delete('/admin/list', function (req, res) {
    var id = req.body.id;
    //var id = req.query.id; url 参数用 query, 匹配参数 params, 其他body;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) console.log(err);
            res.json({success: 1});
        });
    } else {
        res.json({success: 0});
    }
});
