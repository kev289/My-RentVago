"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PropertyRepository } from "@/infrastructure/repositories/property.repository";
import { ManagePropertyUseCase } from "@/application/use-cases/manage-property.use-case";

// Instanciamos el repositorio y el caso de uso
const propertyRepo = new PropertyRepository();
const manageProperty = new ManagePropertyUseCase(propertyRepo);

// Helper para obtener el ID del usuario desde la cookie de sesión
async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: number };
    return decoded.id;
  } catch (error) {
    return null;
  }
}

// ACTION: Crear propiedad (usando el Use Case)
export async function createPropertyAction(formData: FormData) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Debes estar logueado.");

  const data = {
    title: formData.get("title") as string,
    address: formData.get("address") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    userId: userId,
  };

  await manageProperty.createProperty(data);
  revalidatePath("/dashboard/inventory");
}

// ACTION: Maravilloso botón de Borrar con Anti-IDOR
export async function deletePropertyAction(propertyId: number) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("No autorizado.");

  try {
    // Ejecutamos el caso de uso que YA TIENE la protección anti-IDOR
    await manageProperty.deleteProperty(propertyId, userId);
    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
