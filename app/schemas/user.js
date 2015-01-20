var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTORY = 10;//default 加密强度

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    // 0: nomal user 普通,刚注册
    // 1: verify user 如邮箱验证过
    // 2: professonal user 如资料填写比较完整,高级...
    // > 10: admin
    // > 50: super admin
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
}, {collection: 'user'});

/**
 * 每次存储数据save之前调用
 */
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //密码的加密处理
    bcrypt.genSalt(SALT_WORK_FACTORY, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

//实例方法: 通过如查询获取到的实例调用.
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatched) {
            if (err) return cb(err);
            cb(null, isMatched);
        })
    }
};

//静态方法: 通过require 模型调用.
UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .sort('meta.updateAt')
            .exec(cb)
    }
};

module.exports = UserSchema;