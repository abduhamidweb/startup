import {
    Router
} from "express";
import UserController from "../controller/user.schema.js";
import authMiddleware from "../middleware/auth.mddl.js";

const router = Router();



router.post('/users', UserController.createUser);

// Get all users
router.get('/users', UserController.getAllUsers);

// Get a single user by ID
router.get('/users/:id', UserController.getUser);
router.get('/usersown', authMiddleware, UserController.getUserOwn);

// Update a user by ID
router.put('/users', authMiddleware, UserController.updateUser);

// Delete a user by ID
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

// User login
router.post('/users/login', UserController.login);
router.post('/users/forget', UserController.forget);

export default router;