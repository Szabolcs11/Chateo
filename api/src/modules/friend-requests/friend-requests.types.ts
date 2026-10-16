import type { DbDate } from "../../types/database.js";
import type { User } from "../users/users.types.js";

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export type FriendRequest = {
  Id: number;
  SenderId: number;
  ReceiverId: number;
  CreatedAt: DbDate;
  Status: FriendRequestStatus;
  Sender?: User;
  Receiver?: User;
};
