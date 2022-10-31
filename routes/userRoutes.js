const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.singin);
router.post('/google', authController.authGoogle);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/getData', userController.getData)

router.post('/addBoard', userController.addBoard);
router.delete('/deleteBoard/:boardID', userController.deleteBoard);
router.patch('/updateBoard', userController.updateBoard);

router.post('/addTable/:boardID', userController.addTable);
router.delete('/deleteTable/:tableID', userController.deleteTable);

router.post('/updateTask/:tableID', userController.updateTask);

module.exports = router