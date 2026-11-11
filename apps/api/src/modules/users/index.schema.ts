import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
