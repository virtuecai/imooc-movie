var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
module.exports = function (app) {

    // pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user
        app.locals.user = _user
        next()
    })

    // Index
    app.get('/', Index.index)

    // Application
    app.get('/login', User.showLogin)
    app.get('/register', User.showRegister)
    app.get('/logout', User.logout)

    // User
    app.post('/user/register', User.register)
    app.post('/user/login', User.login)
    app.get('/admin/user/list', User.loginRequired, User.adminRequired ,User.list)
    app.delete('/admin/user/list', User.loginRequired, User.adminRequired ,User.del)

    // Movie
    app.get('/movie/:id', Movie.detail)
    app.get('/admin/movie/new', User.loginRequired, User.adminRequired ,Movie.new)
    app.get('/admin/movie/update/:id', User.loginRequired, User.adminRequired ,Movie.update)
    app.post('/admin/movie/new', User.loginRequired, User.adminRequired ,Movie.save)
    app.get('/admin/movie/list', User.loginRequired, User.adminRequired ,Movie.list)
    app.delete('/admin/movie/list', User.loginRequired, User.adminRequired ,Movie.del)

    // Comment
    app.post('/user/comment', User.loginRequired, Comment.save)

}
