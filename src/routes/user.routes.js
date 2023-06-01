import {
    Router
} from "express";
import UserController from "../controller/user.schema.js";

const router = Router();



router.post('/users', UserController.createUser);

// Get all users
router.get('/users', UserController.getAllUsers);

// Get a single user by ID
router.get('/users/:id', UserController.getUser);

// Update a user by ID
router.put('/users/:id', UserController.updateUser);

// Delete a user by ID
router.delete('/users/:id', UserController.deleteUser);

// User login
router.post('/users/login', UserController.login);

export default userRouter;