import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { friendsService } from "./friends.service.js";

export const getFriends: RequestHandler = asyncHandler(async (req, res) => {
  const friends = await friendsService.getAll(req.user!.Id);
  res.status(200).json({ friends });
});

export const deleteFriend: RequestHandler = asyncHandler(async (req, res) => {
  await friendsService.delete(req.user!.Id, Number(req.params["id"]));
  sendSuccess(res, req, { statusCode: 200, messageKey: "success.friendDeleted" });
});
