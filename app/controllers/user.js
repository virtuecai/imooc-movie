var User = require('../models/user')


// register
exports.showRegister = function (req, res) {
    res.render('user/register', {
        title: '注册页面'
    })
}
exports.showLogin = function (req, res) {
    res.render('user/login', {
        title: '登陆页面'
    })
}
exports.register = function (req, res) {
    //res.param("key"), 源码: node_modules\express\lib\request.js, line: 203
    var _user = req.body.user
    User.findOne({name: _user.name}, function (err, user) {
        if (err) console.log(err)

        if (user) {//已经存在
            res.redirect('/login')
        } else {
            var user = new User(_user)
            user.save(function (err, user) {
                if (err) console.log(err)
                res.redirect('/')
            })
        }
    })
}
// login 登录
exports.login = function (req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name: name}, function (err, user) {
        if (err) console.log(err)
        if (!user) {

            return res.redirect('/login')
        }
        //得密码解密处理
        user.comparePassword(password, function (err, isMatched) {
            if (err) console.log(err)
            if (isMatched) {
                console.log('Password is matched!')
                req.session.user = user
                return res.redirect('/')
            }
            else {
                res.redirect('/login')
                console.log('Password is not matched!')
            }
        })
    })
}

// logout
exports.logout = function (req, res) {
    delete req.session.user
    //delete app.locals.user
    res.redirect('/')
}
//list page
exports.list = function (req, res) {
    User.fetch(function (err, users) {
        if (err) console.log(err)
        res.render('user/list', {
            title: 'Imooc 用户列表页',
            users: users
        })
    })
}

//list page delete
exports.del = function (req, res) {
    var id = req.body.id
    //var id = req.query.id url 参数用 query, 匹配参数 params, 其他body
    if (id) {
        User.remove({_id: id}, function (err, movie) {
            if (err) console.log(err)
            res.json({success: 1})
        })
    } else {
        res.json({success: 0})
    }
}

//midware 中间件 for user
exports.loginRequired = function (req, res, next) {
    var user = req.session.user
    if (!user) {
        return res.redirect('/login')
    }
    next();
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user
    if (user.role <= 10) {
        return res.redirect('/login')
    }
    next();
}