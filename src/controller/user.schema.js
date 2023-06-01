import {
    User
} from "../schemas/user.schema.js"
class UserController {
    // Create a new user
    static async createUser(req, res) {
        try {
            const {
                username,
                email,
                password,
                portfolioLink,
                role,
                imageLink
            } = req.body;
            const user = new User({
                username,
                email,
                password,
                portfolioLink,
                role,
                imageLink
            });
            await user.save();
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all users
    static async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get a single user by ID
    static async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: user
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update a user by ID
    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updatedUserData = req.body;
            const user = await User.findByIdAndUpdate(userId, updatedUserData, {
                new: true
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: user
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Delete a user by ID
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: 'User deleted successfully'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    static async login(req, res) {
        try {
            const {
                username,
                password
            } = req.body;

            // Foydalanuvchi uchun autentifikatsiya logikasini yozing
            // Misol uchun, foydalanuvchini usernamedan va passworddan tekshirish:
            const user = await User.findOne({
                username
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
                if (user.password === password) {
                    res.status(200).json({
                        success: true,
                        data: user
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid password'
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}




export default UserController;