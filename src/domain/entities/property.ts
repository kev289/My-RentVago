import { z } from "zod";

export const PropertySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  address: z.string().min(10, "La dirección debe ser más específica"),
  description: z.string().optional().nullable(),
  price: z.number().positive("El precio debe ser un número positivo"),
  userId: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Property = z.infer<typeof PropertySchema>;
