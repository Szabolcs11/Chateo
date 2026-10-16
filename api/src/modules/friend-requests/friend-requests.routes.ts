import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  createFriendRequest,
  getFriendRequests,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  rejectFriendRequest,
} from "./friend-requests.controller.js";
import { createFriendRequestSchema, friendRequestParamsSchema } from "./friend-requests.validation.js";

export const friendRequestsRouter = Router();

friendRequestsRouter.use(requireAuth);
friendRequestsRouter.get("/", getFriendRequests);
friendRequestsRouter.get("/incoming", getIncomingFriendRequests);
friendRequestsRouter.get("/outgoing", getOutgoingFriendRequests);
friendRequestsRouter.post("/", validate({ body: createFriendRequestSchema }), createFriendRequest);
friendRequestsRouter.post("/:id/accept", validate({ params: friendRequestParamsSchema }), acceptFriendRequest);
friendRequestsRouter.post("/:id/reject", validate({ params: friendRequestParamsSchema }), rejectFriendRequest);
friendRequestsRouter.delete("/:id", validate({ params: friendRequestParamsSchema }), cancelFriendRequest);
