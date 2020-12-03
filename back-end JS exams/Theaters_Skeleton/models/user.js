const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const Types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength:3,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength:3,
        required: true
    },
    likedPlays : [{ type: Types.ObjectId, ref: 'play' }]
});

userSchema.methods.comparePasswords = function (providedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(providedPassword, this.password, function (err, result) {
            if (err) { reject(err); return; }
            resolve(result);
        })
    })
}


userSchema.pre('save', function (done) {
    const user = this;

    if (!user.isModified('password')) {
        done();
        return;
    }

    bcrypt.genSalt(config.saltRounds, (err, salt) => {
        if (err) { done(err); return; }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { done(err); return; }
            user.password = hash;
            done();
        });
    });
});


module.exports = new mongoose.model('user', userSchema);