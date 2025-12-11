// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:cnic', userController.getUserByCNIC);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.put('/:cnic', userController.updateUser);
router.delete('/:cnic', userController.deleteUser);

module.exports = router;