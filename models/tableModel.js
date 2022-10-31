const mongoose = require('mongoose');

// Board Schema Layout
const tableSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.ObjectId,
        ref: 'Board',
        required: [true, 'Please provide a valid board!']
    },
    name: {
        type: String,
        require: [true, 'Please provide a board name!']
    },
    tasks: [
        {
            type: String,
            required: [true, 'Please provide tasks!']
        }
    ]
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;