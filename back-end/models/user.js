var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    token: {type: String, required: true},
    // tokenExpDate: {type: Date, required: true}
    tokenExpDate: Date
});

module.exports = mongoose.model('User', userSchema);
