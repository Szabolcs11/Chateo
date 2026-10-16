import { z } from "zod";

const idSchema = z.coerce.number().int().positive();

export const createFriendRequestSchema = z.object({
  receiverId: idSchema,
});

export const friendRequestParamsSchema = z.object({
  id: idSchema,
});

export type CreateFriendRequestInput = z.infer<typeof createFriendRequestSchema>;
