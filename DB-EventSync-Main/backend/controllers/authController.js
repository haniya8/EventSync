// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { createUser, findUserByEmail } = require("../models/UserModel");

// // Signup Controller
// async function signup(req, res) {
//   const { email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await createUser(email, hashedPassword);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// }

// // Signin Controller
// async function signin(req, res) {
//   const { email, password } = req.body;
//   try {
//     const user = await findUserByEmail(email);
//     if (!user) return res.status(400).json({ error: "User not found" });
//     console.log(user);
//     const isMatch = await bcrypt.compare(password, user[1]);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ userId: user[0] }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// }

// module.exports = { signup, signin };
