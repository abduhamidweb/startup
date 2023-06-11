import { Router } from "express";
import TechnologyController from "../controller/technology.contr.js";
import authMiddleware from "../middleware/auth.mddl.js";

const technologyRouter = Router();

technologyRouter.get("/technologies", TechnologyController.Get);
technologyRouter.get(
  "/technologies/:id",
  TechnologyController.Get
);
technologyRouter.post(
  "/technologies",
  authMiddleware,
  TechnologyController.Post
);
technologyRouter.put(
  "/technologies/:id",
  authMiddleware,
  TechnologyController.Put
);
technologyRouter.delete(
  "/technologies/:id",
  authMiddleware,
  TechnologyController.Delete
);

export default technologyRouter;
