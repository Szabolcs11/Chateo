import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { deleteFriend, getFriends } from "./friends.controller.js";
import { friendParamsSchema } from "./friends.validation.js";

export const friendsRouter = Router();

friendsRouter.use(requireAuth);
friendsRouter.get("/", getFriends);
friendsRouter.delete("/:id", validate({ params: friendParamsSchema }), deleteFriend);
