// backend/controllers/userController.js
const userModel = require('../models/UserModel');

// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await userModel.listAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

// Get user by CNIC
async function getUserByCNIC(req, res) {
    try {
        const { cnic } = req.params;
        const user = await userModel.getUserByCNIC(cnic);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserByCNIC:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}

// Login user
async function loginUser(req, res) {
    console.log('🔥🔥🔥 LOGINUSER FUNCTION CALLED 🔥🔥🔥');
    console.log('📦 Request body:', req.body);
    console.log('📧 Email received:', req.body.email);
    console.log('🔑 Password received:', req.body.password);
    
    try {
        console.log('✅ Inside try block');
        const { email, password } = req.body;
        
        console.log('📝 Extracted email:', email);
        console.log('📝 Extracted password:', password);
        console.log('📏 Email length:', email?.length);
        console.log('📏 Password length:', password?.length);
        
        if (!email || !password) {
            console.log('❌ Validation failed - missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        console.log('🔍 Calling userModel.loginUser...');
        const user = await userModel.loginUser(email, password);
        
        console.log('👤 User returned from model:', user);
        console.log('❓ Is user null?', user === null);
        console.log('❓ Is user undefined?', user === undefined);
        console.log('❓ User truthiness:', !!user);
        
        if (!user) {
            console.log('❌ LOGIN FAILED - No user found with these credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        console.log('✅ User found! Properties:', Object.keys(user));
        console.log('✅ CNIC:', user.CNIC);
        console.log('✅ NAME:', user.NAME);
        console.log('✅ EMAIL:', user.EMAIL);
        console.log('✅ PHONE:', user.PHONE);
        
        const responseData = {
            cnic: user.CNIC,
            name: user.NAME,
            email: user.EMAIL,
            phone: user.PHONE
        };
        
        console.log('📤 Sending response:', responseData);
        res.status(200).json(responseData);
        console.log('✅✅✅ LOGIN SUCCESS ✅✅✅');
        
    } catch (error) {
        console.error('💥💥💥 Error in loginUser:', error);
        console.error('💥 Error stack:', error.stack);
        res.status(500).json({ error: 'Login failed' });
    }
}

// Register user
async function registerUser(req, res) {
    try {
        const { cnic, name, email, password, phone } = req.body;
        
        if (!cnic || !name || !email || !password) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        const user = await userModel.registerUser(cnic, name, email, password, phone);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error in registerUser:', error);
        if (error.message.includes('unique constraint')) {
            res.status(409).json({ error: 'Email or CNIC already exists' });
        } else {
            res.status(500).json({ error: 'Registration failed' });
        }
    }
}

// Update user
async function updateUser(req, res) {
    try {
        const { cnic } = req.params;
        const { name, email, phone } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const user = await userModel.updateUser(cnic, name, email, phone);
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}

// Delete user
async function deleteUser(req, res) {
    try {
        const { cnic } = req.params;
        await userModel.deleteUser(cnic);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

module.exports = {
    getAllUsers,
    getUserByCNIC,
    loginUser,
    registerUser,
    updateUser,
    deleteUser
};