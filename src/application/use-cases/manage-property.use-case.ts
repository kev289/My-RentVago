import { PropertyRepository } from "@/infrastructure/repositories/property.repository";
import { Property } from "@/domain/entities/property";

export class ManagePropertyUseCase {
  constructor(private propertyRepo: PropertyRepository) {}

  // Acción de listar propiedades del usuario
  async getPropertiesByUser(userId: number) {
    return await this.propertyRepo.getByUserId(userId);
  }

  // Acción de crear una nueva propiedad
  async createProperty(data: Omit<Property, "id" | "createdAt" | "updatedAt">) {
    return await this.propertyRepo.create(data);
  }

  // 🔥 ACCIÓN CRÍTICA: Eliminar con Protección Anti-IDOR 🔥
  async deleteProperty(propertyId: number, currentUserId: number) {
    // 1. Buscamos primero la propiedad en la DB
    const property = await this.propertyRepo.getById(propertyId);

    if (!property) {
      throw new Error("La propiedad no existe.");
    }

    // 2. REGLA DE ORO ANTI-IDOR:
    // Comparamos el dueño de la casa (property.userId) con el usuario logueado (currentUserId)
    if (property.userId !== currentUserId) {
      throw new Error("⚠️ BLOQUEADO: No tienes permiso para borrar la propiedad de otro usuario.");
    }

    // 3. Si todo está bien, procedemos al borrado
    return await this.propertyRepo.delete(propertyId);
  }
}
