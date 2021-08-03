const bcrypt = require('bcrypt');

exports.cryptPassword = function (password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function (hashErr, hash) {
            return callback(hashErr, hash);
        });
    });
};

exports.comparePassword = function (plain, hashed, callback) {
    bcrypt.compare(plain, hashed, function (err, isPasswordMatch) {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};
