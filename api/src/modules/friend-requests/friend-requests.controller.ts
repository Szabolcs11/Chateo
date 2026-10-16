import type { RequestHandler } from "express";

import { sendSuccess } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { friendRequestsService } from "./friend-requests.service.js";

export const getFriendRequests: RequestHandler = asyncHandler(async (req, res) => {
  const friendRequests = await friendRequestsService.getAll(req.user!.Id);
  res.status(200).json({ friendRequests });
});

export const getIncomingFriendRequests: RequestHandler = asyncHandler(async (req, res) => {
  const friendRequests = await friendRequestsService.getIncoming(req.user!.Id);
  res.status(200).json({ friendRequests });
});

export const getOutgoingFriendRequests: RequestHandler = asyncHandler(async (req, res) => {
  const friendRequests = await friendRequestsService.getOutgoing(req.user!.Id);
  res.status(200).json({ friendRequests });
});

export const createFriendRequest: RequestHandler = asyncHandler(async (req, res) => {
  const friendRequest = await friendRequestsService.create(req.user!.Id, req.body);
  sendSuccess(res, req, { statusCode: 201, messageKey: "success.friendRequestCreated", data: { friendRequest } });
});

export const acceptFriendRequest: RequestHandler = asyncHandler(async (req, res) => {
  await friendRequestsService.accept(req.user!.Id, Number(req.params["id"]));
  sendSuccess(res, req, { statusCode: 200, messageKey: "success.friendRequestAccepted" });
});

export const rejectFriendRequest: RequestHandler = asyncHandler(async (req, res) => {
  await friendRequestsService.reject(req.user!.Id, Number(req.params["id"]));
  sendSuccess(res, req, { statusCode: 200, messageKey: "success.friendRequestRejected" });
});

export const cancelFriendRequest: RequestHandler = asyncHandler(async (req, res) => {
  await friendRequestsService.cancel(req.user!.Id, Number(req.params["id"]));
  sendSuccess(res, req, { statusCode: 200, messageKey: "success.friendRequestCancelled" });
});
