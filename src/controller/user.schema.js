import {
    User
} from "../schemas/user.schema.js"
import {
    sendConfirmationEmail
} from "../utils/nodemailer.js";
import {
    JWT
} from './../utils/jwt.js';
import sha256 from "sha256";
import redis from "redis";
const client = redis.createClient({
    url: "redis://default:B4JeLupwqLq3XcMD3pUK6NUhVWn0JbQD@redis-11891.c291.ap-southeast-2-1.ec2.cloud.redislabs.com:11891"
});
client.connect();
class UserController {
    // Create a new user
    // createUser funksiyasi
    // createUser funksiyasi
    // createUser funksiyasi
    // createUser funksiyasi
    // createUser funksiyasi
    // createUser funksiyasi
    static async createUser(req, res) {
        try {
            const {
                username,
                email,
                portfolioLink,
                role,
                imageLink,
                confirmationCode // Foydalanuvchi kiritgan tasdiqlash kodi
            } = req.body;
            // Birinchi marta post qilganda foydalanuvchi ma'lumotlarini yuborish
            if (!confirmationCode) {
                const generatedConfirmationCode = await sendConfirmationEmail(email);
                await client.set(email, generatedConfirmationCode)
                return res.status(200).json({
                    success: true,
                    message: "Foydalanuvchi ma'lumotlari yuborildi. Tasdiqlash kodi yuborildi",
                    confirmationCode: generatedConfirmationCode // Tasdiqlash kodi javob qaytariladi
                });
            }
            // Tasdiqlash kodi tekshirish
            if (confirmationCode !== await client.get(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Noto'g'ri tasdiqlash kodi"
                });
            }
            // Foydalanuvchi saqlash uchun yangi User obyekti yaratish
            const user = new User({
                username,
                email,
                password: sha256(req.body.password),
                portfolioLink,
                role,
                imageLink
            });
            // Tasdiqlangan foydalanuvchini saqlash
            await user.save();
            // Token yaratish va javob qaytarish 
            res.status(201).json({
                success: true,
                token: JWT.SIGN({
                    id: user._id
                }),
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
    static async getUserOwn(req, res) {
        try {
            let token = req.headers.token
            const id = JWT.VERIFY(token).id;
            let user = await User.find({
                _id: id
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
               const passwordMatches = user.password === sha256(user.password);
               if (!passwordMatches) {
                   return res.status(401).json({
                       success: false,
                       error: 'Incorrect password'
                   });
               }
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
            const token = req.headers.token;
            let usertokenId = JWT.VERIFY(token).id;
            // const userId = req.params.id;
            // if (usertokenId != userId) {
            //     res.status(404).json({
            //         success: false,
            //         error: 'you have not authenticated or you will do cheating'
            //     });
            // }
            const updatedUserData = req.body;
            const user = await User.findByIdAndUpdate(usertokenId, updatedUserData, {
                new: true
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                await user.save();
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
            const token = req.headers.token;
            let usertokenId = JWT.VERIFY(token).id;
            const {
                role
            } = await User.findById(usertokenId);
            if (role === 'admin') {
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
            } else {
                res.status(404).json({
                    success: false,
                    error: "faqatgina admin o'chira olishi mumkun userlarni "
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
                email,
                password
            } = req.body;

            // Foydalanuvchi uchun autentifikatsiya logikasini yozing
            // Misol uchun, foydalanuvchini emaildan va passworddan tekshirish:
            const user = await User.findOne({
                email
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            } else {
                if (user.password === sha256(password)) {
                    res.status(201).json({
                        success: true,
                        token: JWT.SIGN({
                            id: user._id
                        }),
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
    static async forget(req, res) {
        try {
            const {
                email,
                confirmationCode
            } = req.body;
            const user = await User.findOne({
                email
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            if (!confirmationCode) {
                const generatedConfirmationCode = await sendConfirmationEmail(email);
                await client.set(email, generatedConfirmationCode)
                return res.status(200).json({
                    success: true,
                    message: "Foydalanuvchi ma'lumotlari yuborildi. Tasdiqlash kodi yuborildi",
                    confirmationCode: generatedConfirmationCode // Tasdiqlash kodi javob qaytariladi
                });
            }
            // Tasdiqlash kodi tekshirish
            if (confirmationCode !== await client.get(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Noto'g'ri tasdiqlash kodi"
                });
            }

            await User.findOneAndUpdate({
                email
            }, {
                password: sha256(req.body.password)
            })
            res.status(201).json({
                success: true,
                token: JWT.SIGN({
                    id: user._id
                }),
                data: user
            });
        } catch (error) {
            console.log('error :', error);
            res.status(500).json({
                error: 'Foydalanuvchi qo\'shishda xatolik yuz berdi'
            });
        }
    }
}




export default UserController;