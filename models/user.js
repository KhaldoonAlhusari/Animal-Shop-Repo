const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean
    },
    img: {
        type: String,
        default: "https://brighterwriting.com/wp-content/uploads/icon-user-default.png"
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;