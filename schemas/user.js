var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
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
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //密码的加密处理
    next();
});

//实例方法: 通过如查询获取到的实例调用.
UserSchema.methods = {
  comparePassword: function (_password, cb) {
     /* bcrypt.compare(_password, this.password, function (err, isMatch) {
         if(err) return cb(err);
          cb(nul, isMatch);
      });*/
      if(this.password == _password) {
          cb(null, true);
      } else {
          return cb('Wrong password!', false);
      }
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