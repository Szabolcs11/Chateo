import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/database.js";
import type { User } from "../users/users.types.js";

export const friendsRepository = {
  async findAllForUser(userId: number): Promise<User[]> {
    const [rows] = await db.execute(
      `
        SELECT users.Id, users.FullName, users.Email, users.AvatarUrl, users.CreatedAt
        FROM friendships
        INNER JOIN users ON (
          (friendships.UserId = ? AND users.Id = friendships.FriendId)
          OR (friendships.FriendId = ? AND users.Id = friendships.UserId)
        )
        WHERE friendships.UserId = ? OR friendships.FriendId = ?
        ORDER BY friendships.CreatedAt DESC
      `,
      [userId, userId, userId, userId],
    );
    return rows as User[];
  },

  async deleteForUser(userId: number, friendId: number): Promise<boolean> {
    const [result] = await db.execute(
      "DELETE FROM friendships WHERE (UserId = ? AND FriendId = ?) OR (UserId = ? AND FriendId = ?)",
      [userId, friendId, friendId, userId],
    );
    return (result as ResultSetHeader).affectedRows > 0;
  },
};
