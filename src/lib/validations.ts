import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(6, 'La password deve avere almeno 6 caratteri'),
});

export const registerSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(6, 'La password deve avere almeno 6 caratteri'),
  confirmPassword: z.string().min(6, 'Conferma la password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non coincidono',
  path: ['confirmPassword'],
});

export const generatePostSchema = z.object({
  topic: z.string().min(3, 'Il topic deve avere almeno 3 caratteri').max(500, 'Il topic non può superare 500 caratteri'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type GeneratePostFormData = z.infer<typeof generatePostSchema>;

export const updateProfileSchema = z.object({
  firstName: z.string().max(50, 'Il nome non può superare 50 caratteri').optional().or(z.literal('')),
  lastName: z.string().max(50, 'Il cognome non può superare 50 caratteri').optional().or(z.literal('')),
  phone: z.string().max(20, 'Il telefono non può superare 20 caratteri').optional().or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
