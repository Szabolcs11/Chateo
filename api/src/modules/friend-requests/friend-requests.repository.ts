import type { ResultSetHeader, RowDataPacket } from "mysql2";

import { db } from "../../config/database.js";
import { getDateTime } from "../../utils/shared-functions.js";
import type { FriendRequest, FriendRequestStatus } from "./friend-requests.types.js";

type FriendRequestRow = RowDataPacket & {
  Id: number;
  RequestSenderId: number;
  RequestReceiverId: number;
  CreatedAt: FriendRequest["CreatedAt"];
  Status: FriendRequestStatus;
  SenderFullName: string;
  SenderEmail: string;
  SenderAvatarUrl: string;
  ReceiverFullName: string;
  ReceiverEmail: string;
  ReceiverAvatarUrl: string;
};

const friendRequestColumns = `
  friend_requests.Id,
  friend_requests.SenderId AS RequestSenderId,
  friend_requests.ReceiverId AS RequestReceiverId,
  friend_requests.CreatedAt,
  friend_requests.Status,
  sender.FullName AS SenderFullName,
  sender.Email AS SenderEmail,
  sender.AvatarUrl AS SenderAvatarUrl,
  receiver.FullName AS ReceiverFullName,
  receiver.Email AS ReceiverEmail,
  receiver.AvatarUrl AS ReceiverAvatarUrl
`;

function mapFriendRequest(row: FriendRequestRow): FriendRequest {
  return {
    Id: row.Id,
    SenderId: row.RequestSenderId,
    ReceiverId: row.RequestReceiverId,
    CreatedAt: row.CreatedAt,
    Status: row.Status,
    Sender: {
      Id: row.RequestSenderId,
      FullName: row.SenderFullName,
      Email: row.SenderEmail,
      AvatarUrl: row.SenderAvatarUrl,
      CreatedAt: row.CreatedAt,
    },
    Receiver: {
      Id: row.RequestReceiverId,
      FullName: row.ReceiverFullName,
      Email: row.ReceiverEmail,
      AvatarUrl: row.ReceiverAvatarUrl,
      CreatedAt: row.CreatedAt,
    },
  };
}

const selectFriendRequest = `
  SELECT ${friendRequestColumns}
  FROM friend_requests
  INNER JOIN users AS sender ON sender.Id = friend_requests.SenderId
  INNER JOIN users AS receiver ON receiver.Id = friend_requests.ReceiverId
`;

export const friendRequestsRepository = {
  async findAllForUser(userId: number): Promise<FriendRequest[]> {
    const [rows] = await db.execute(
      `${selectFriendRequest} WHERE friend_requests.SenderId = ? OR friend_requests.ReceiverId = ? ORDER BY friend_requests.CreatedAt DESC`,
      [userId, userId],
    );
    return (rows as FriendRequestRow[]).map(mapFriendRequest);
  },

  async findIncomingForUser(userId: number): Promise<FriendRequest[]> {
    const [rows] = await db.execute(
      `${selectFriendRequest} WHERE friend_requests.ReceiverId = ? ORDER BY friend_requests.CreatedAt DESC`,
      [userId],
    );
    return (rows as FriendRequestRow[]).map(mapFriendRequest);
  },

  async findOutgoingForUser(userId: number): Promise<FriendRequest[]> {
    const [rows] = await db.execute(
      `${selectFriendRequest} WHERE friend_requests.SenderId = ? ORDER BY friend_requests.CreatedAt DESC`,
      [userId],
    );
    return (rows as FriendRequestRow[]).map(mapFriendRequest);
  },

  async findById(requestId: number): Promise<FriendRequest | null> {
    const [rows] = await db.execute(`${selectFriendRequest} WHERE friend_requests.Id = ? LIMIT 1`, [requestId]);
    const row = (rows as FriendRequestRow[])[0];
    return row ? mapFriendRequest(row) : null;
  },

  async userExists(userId: number): Promise<boolean> {
    const [rows] = await db.execute("SELECT 1 FROM users WHERE Id = ? LIMIT 1", [userId]);
    return (rows as RowDataPacket[]).length > 0;
  },

  async findPendingBetweenUsers(firstUserId: number, secondUserId: number): Promise<FriendRequest | null> {
    const [rows] = await db.execute(
      `${selectFriendRequest} WHERE ((friend_requests.SenderId = ? AND friend_requests.ReceiverId = ?) OR (friend_requests.SenderId = ? AND friend_requests.ReceiverId = ?)) AND friend_requests.Status = 'PENDING' LIMIT 1`,
      [firstUserId, secondUserId, secondUserId, firstUserId],
    );
    const row = (rows as FriendRequestRow[])[0];
    return row ? mapFriendRequest(row) : null;
  },

  async friendshipExists(firstUserId: number, secondUserId: number): Promise<boolean> {
    const [rows] = await db.execute(
      "SELECT 1 FROM friendships WHERE (UserId = ? AND FriendId = ?) OR (UserId = ? AND FriendId = ?) LIMIT 1",
      [firstUserId, secondUserId, secondUserId, firstUserId],
    );
    return (rows as RowDataPacket[]).length > 0;
  },

  async create(senderId: number, receiverId: number): Promise<FriendRequest> {
    const [result] = await db.execute(
      "INSERT INTO friend_requests (SenderId, ReceiverId, CreatedAt, Status) VALUES (?, ?, ?, 'PENDING')",
      [senderId, receiverId, getDateTime()],
    );
    const request = await this.findById((result as ResultSetHeader).insertId);
    if (!request) throw new Error("Created friend request was not found");
    return request;
  },

  async updateStatus(requestId: number, status: FriendRequestStatus): Promise<boolean> {
    const [result] = await db.execute("UPDATE friend_requests SET Status = ? WHERE Id = ? AND Status = 'PENDING'", [status, requestId]);
    return (result as ResultSetHeader).affectedRows === 1;
  },

  async acceptAndCreateFriendship(requestId: number, senderId: number, receiverId: number): Promise<boolean> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [updated] = await connection.execute(
        "UPDATE friend_requests SET Status = 'ACCEPTED' WHERE Id = ? AND ReceiverId = ? AND Status = 'PENDING'",
        [requestId, receiverId],
      );

      if ((updated as ResultSetHeader).affectedRows !== 1) {
        await connection.rollback();
        return false;
      }

      await connection.execute("INSERT INTO friendships (UserId, FriendId, CreatedAt) VALUES (?, ?, ?)", [senderId, receiverId, getDateTime()]);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
