const mongoose = require('mongoose')

// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

module.exports = mongoose.model('User', userSchema);