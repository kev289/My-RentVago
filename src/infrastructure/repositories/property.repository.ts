import { prisma } from "@/lib/db/prisma";
import { Property } from "@/domain/entities/property";

export class PropertyRepository {
  // Obtener todas las propiedades de un usuario específico (para su dashboard)
  async getByUserId(userId: number) {
    return await prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Buscar una propiedad por su ID
  async getById(id: number) {
    return await prisma.property.findUnique({
      where: { id },
    });
  }

  // Crear una propiedad nueva
  async create(data: Omit<Property, "id" | "createdAt" | "updatedAt">) {
    return await prisma.property.create({
      data: {
        ...data,
        price: data.price.toString() as any, // Lo convertimos a string para que Prisma lo acepte como Decimal
      },
    });
  }

  // Eliminar una propiedad (Ojo: el borrado real solo se llama después de validar IDOR)
  async delete(id: number) {
    return await prisma.property.delete({
      where: { id },
    });
  }
}
