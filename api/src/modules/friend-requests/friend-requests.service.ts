import { AppError } from "../../utils/app-error.js";
import { friendRequestsRepository } from "./friend-requests.repository.js";
import type { FriendRequest } from "./friend-requests.types.js";
import type { CreateFriendRequestInput } from "./friend-requests.validation.js";

export const friendRequestsService = {
  async getAll(userId: number): Promise<FriendRequest[]> {
    return friendRequestsRepository.findAllForUser(userId);
  },

  async getIncoming(userId: number): Promise<FriendRequest[]> {
    return friendRequestsRepository.findIncomingForUser(userId);
  },

  async getOutgoing(userId: number): Promise<FriendRequest[]> {
    return friendRequestsRepository.findOutgoingForUser(userId);
  },

  async create(senderId: number, input: CreateFriendRequestInput): Promise<FriendRequest> {
    const { receiverId } = input;

    if (senderId === receiverId) throw new AppError(400, "friendRequest.cannotSendToSelf");
    if (!(await friendRequestsRepository.userExists(receiverId))) throw new AppError(404, "user.not_found");
    if (await friendRequestsRepository.friendshipExists(senderId, receiverId)) {
      throw new AppError(409, "friendRequest.alreadyFriends");
    }
    if (await friendRequestsRepository.findPendingBetweenUsers(senderId, receiverId)) {
      throw new AppError(409, "friendRequest.alreadyPending");
    }

    return friendRequestsRepository.create(senderId, receiverId);
  },

  async accept(userId: number, requestId: number): Promise<void> {
    const request = await this.getPendingRequest(requestId);
    if (request.ReceiverId !== userId) throw new AppError(403, "errors.forbidden");

    const accepted = await friendRequestsRepository.acceptAndCreateFriendship(requestId, request.SenderId, userId);
    if (!accepted) throw new AppError(409, "friendRequest.noLongerPending");
  },

  async reject(userId: number, requestId: number): Promise<void> {
    const request = await this.getPendingRequest(requestId);
    if (request.ReceiverId !== userId) throw new AppError(403, "errors.forbidden");

    const rejected = await friendRequestsRepository.updateStatus(requestId, "REJECTED");
    if (!rejected) throw new AppError(409, "friendRequest.noLongerPending");
  },

  async cancel(userId: number, requestId: number): Promise<void> {
    const request = await this.getPendingRequest(requestId);
    if (request.SenderId !== userId) throw new AppError(403, "errors.forbidden");

    const cancelled = await friendRequestsRepository.updateStatus(requestId, "CANCELLED");
    if (!cancelled) throw new AppError(409, "friendRequest.noLongerPending");
  },

  async getPendingRequest(requestId: number): Promise<FriendRequest> {
    const request = await friendRequestsRepository.findById(requestId);
    if (!request) throw new AppError(404, "friendRequest.notFound");
    if (request.Status !== "PENDING") throw new AppError(409, "friendRequest.noLongerPending");
    return request;
  },
};
