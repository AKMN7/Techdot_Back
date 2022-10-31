const mongoose = require('mongoose');

// Board Schema Layout
const boardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a valid user!']
    },
    name: {
        type: String,
        require: [true, 'Please provide a board name!']
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;