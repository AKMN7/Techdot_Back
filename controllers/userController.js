const User = require('../models/userModel');
const Board = require('../models/boardModel');
const Table = require('../models/tableModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get User Data
exports.getData = catchAsync(async (req, res, next) => {

    const results = [];

    // Get the board list
    const boards = await Board.find({ user: req.user._id });

    for (const el of boards) {
        let finialized = {};
        finialized.id = el._id;
        finialized.name = el.name;
        finialized.tabels = [];

        const tabels = await Table.find({ board: el._id });
        for (const elm of tabels) {
            finialized.tabels.push({
                name: elm.name,
                id: elm.id,
                tasks: elm.tasks
            });
        }

        results.push(finialized);
    }

    res.status(200).json({
        status: "success",
        data: {
            results
        }
    });

});

// Add a new Board
exports.addBoard = catchAsync(async (req, res, next) => {
    const newBoard = await Board.create({
        user: req.user._id,
        name: req.body.name
    });

    res.status(200).json({
        status: "success",
        data: {
            newBoard
        }
    });
});


// Delete a Board
exports.deleteBoard = catchAsync(async (req, res, next) => {
    await Table.deleteMany({ board: req.params.boardID });
    const deleted = await Board.findByIdAndDelete({ _id: req.params.boardID, user: req.user._id });

    if (!deleted) return next(new AppError("Board with the same ID not found!", 404));

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Update Board Information
exports.updateBoard = catchAsync(async (req, res, _) => {

    const toUpdate = req.body.board || null;

    // Check if there is a baord and it has tables
    if (toUpdate && toUpdate.tabels.length) {

        for (const el of toUpdate.tabels) {
            // Check if Table is new
            if (el.new) {
                // Create New Table
                await Table.create({
                    board: toUpdate.id,
                    name: el.name,
                    tasks: el.tasks
                });

            } else if (el.toDelete) {
                await Table.findByIdAndDelete(el.id);
            } else {
                // Get Table
                const table = await Table.findById(el.id);

                // Update and save table
                table.tasks = el.tasks;
                await table.save();
            }

        }
    }

    res.status(200).json({
        status: 'success',
    });

});

// Add a new Board
exports.addTable = catchAsync(async (req, res, next) => {

    const board = await Board.findById(req.params.boardID);

    // Check if the board id provided is valid
    if (!board) return next(new AppError("Invalid BoardID", 404));

    // Crate new Table
    const newTable = await Table.create({
        board: req.params.boardID,
        name: req.body.name,
        tasks: []
    });

    res.status(200).json({
        status: "success",
        data: {
            newTable
        }
    });
});

// Delete a Board
exports.deleteTable = catchAsync(async (req, res, next) => {

    // Get Table
    const table = await Table.findById(req.params.tableID);

    // Check if the table exists
    if (!table) return next(new AppError("Table with the same ID not found!", 404));

    // Delete Table
    await Table.findByIdAndDelete(table._id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Update (add and delte task)
exports.updateTask = catchAsync(async (req, res, next) => {

    // Check for new taks array
    if (!req.body.taskArr) return next(new AppError("Missing Task Array", 404));

    // Get Table
    const table = await Table.findById(req.params.tableID);

    // Check if the table exists
    if (!table) return next(new AppError("Table with the same ID not found!", 404));

    // Update and save table
    table.tasks = req.body.taskArr;
    await table.save();

    res.status(200).json({
        status: 'success',
        data: {
            table
        }
    });
});