var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('cookie-session')
var morgan = require('morgan')
var path = require('path')
var mongoose = require('mongoose')

var port = process.env.PORT || 3000 //cmd: PORT=4000 node app.js
var app = express()



// DB cfg
//mongoose.connect('mongodb://localhost/movie')
var dbUrl = 'mongodb://root:root@192.168.168.104:27017/movie'
mongoose.connect(dbUrl)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'mongodb connection error ...'))
db.once('open', function callback() {
    console.info("mongodb opened ...")
})

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())
//保持会话
app.use(session({
    name: 'express:sess',
    secret: 'imooc'
}))

if('development' == app.get('env')) {//环境变量, 开发环境
    app.set('showStackError', true)//异常信息控制台打印
    app.use(morgan(':method   :url   :status'))
    app.locals.pretty = true//格式化页面源码,默认压缩
    mongoose.set('debug', true)//mongodb debug 日志输出
}

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname, 'public')))

console.log('movie started on port ' + port)
