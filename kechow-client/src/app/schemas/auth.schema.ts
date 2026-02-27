/**
 * Auth schemas with Zod — modernize form validation.
 * Requires: npm install zod
 * Use validateLoginSafe() before submit; bind errors to Spanish UI (no string changes).
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requerido').email('Correo no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'owner', 'delivery', 'admin']),
});

export const loginResponseSchema = z.object({
  user: userSchema,
});

export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export function validateLogin(data: unknown): LoginInput {
  return loginSchema.parse(data);
}

export function validateLoginSafe(
  data: unknown
): z.SafeParseReturnType<LoginInput, LoginInput> {
  return loginSchema.safeParse(data);
}
