import validator from 'validator';
import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
        match: /^[a-zA-Z]+$/,
        validate: {
            validator: (value) => {
                return validator.isAlphanumeric(value);
            },
            message: 'Username must only contain alphanumeric characters'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true,
        // minlength: 8,
    //    validate: {
    //        validator: (value) => {
    //            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
    //        },
    //        message: "Parol kamida 8 ta belgidan iborat bo'lishi, raqam va harflarni o'z ichiga olgan kombinatsiyasi bo'lishi kerak."
    //    }
    },
    portfolioLink: {
        type: String,
        validate: [{
                validator: (value) => {
                    return validator.isURL(value);
                },
                message: 'Invalid portfolio link'
            },
            {
                validator: (value) => {
                    return value !== 'example.com'; // Masalan, 'example.com' qiymati xato deb qabul qilinsin
                },
                message: 'Portfolio link cannot be example.com'
            }
        ]
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    imageLink: {
        type: String,
        validate: {
            validator: (value) => {
                return validator.isURL(value);
            },
            message: 'Invalid image link'
        }
    }
});

export const User = mongoose.model('User', userSchema);