import { AppError } from "../../utils/app-error.js";
import { friendsRepository } from "./friends.repository.js";
import type { User } from "../users/users.types.js";

export const friendsService = {
  async getAll(userId: number): Promise<User[]> {
    return friendsRepository.findAllForUser(userId);
  },

  async delete(userId: number, friendId: number): Promise<void> {
    const deleted = await friendsRepository.deleteForUser(userId, friendId);
    if (!deleted) throw new AppError(404, "friend.notFound");
  },
};
