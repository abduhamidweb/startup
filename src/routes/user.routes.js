import { Router } from "express";
import userController from "../controller/user.schema.js";

const userRouter = Router();



userRouter.get('/', userController.test)


export default userRouter;