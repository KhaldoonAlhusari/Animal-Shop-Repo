const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
    animalInfo: {
        animal: {
            type: String,
            required: true
        },
        breed: {
            type: String,
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    img: {
        type: String,
        required: true
    },
    trained: {
        type: Boolean
    },
    adopted: {
        type: Boolean,
        default: false
    }
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;