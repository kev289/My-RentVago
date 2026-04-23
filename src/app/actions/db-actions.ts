"use server"

import { prisma } from "@/lib/db/prisma"; 
import { Prisma } from "@prisma/client";
import { PropertySchema, LeaseSchema, PaymentSchema, UserSchema, RegisterSchema, LoginSchema } from "@/models/schemas"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Línea 12 aproximadamente
export interface FormState<T = unknown> {
  success?: boolean;
  error?: string;
  details?: Record<string, string[] | undefined>;
  data?: T; // Ahora data es del tipo T que le pasemos
}


//  ACCIONES DE USUARIOS (Users)
export async function createUserAction(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const rawData = {
    email: formData.get("email"),
    name: formData.get("name"),
  };

  const validatedData = UserSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { 
      error: "Revisa el formulario de Usuario", 
      details: validatedData.error.flatten().fieldErrors 
    };
  }

  try {
    const { email, name, password } = validatedData.data;
    const passwordToHash = password || "RentVago2026!";
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const newUser = await prisma.user.create({ 
      data: {
        email,
        name,
        password: hashedPassword
      } satisfies Prisma.UserCreateInput
    });
    return { success: true, data: newUser };
  } catch (error) {
    return { error: "El correo ya existe o hubo un error interno." };
  }
}

// ACCIÓN DE REGISTRO
export async function registerAction(
  prevState: FormState<{ id: number; email: string }> | null, 
  formData: FormData
): Promise<FormState<{ id: number; email: string }>> {
  const rawData = Object.fromEntries(formData);
  const validatedData = RegisterSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { 
      error: "Error de validación en el registro", 
      details: validatedData.error.flatten().fieldErrors 
    };
  }

  try {
    const { email, password, name } = validatedData.data;

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "El correo ya está registrado." };

    // HASHEO DE CONTRASEÑA
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, name: name ?? null, password: hashedPassword } satisfies Prisma.UserCreateInput
    });

    // AUTO-LOGIN: Generar token y setear cookie
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });
  } catch (error) {
    return { error: "Error al crear la cuenta." };
  }

  redirect("/"); 
}

// ACCIÓN DE LOGIN
export async function loginAction(
  prevState: FormState<{ token: string; user: { email: string } }> | null, 
  formData: FormData
): Promise<FormState<{ token: string; user: { email: string } }>> {
  const rawData = Object.fromEntries(formData);
  const validatedData = LoginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { 
      error: "Datos de login inválidos", 
      details: validatedData.error.flatten().fieldErrors 
    };
  }

  try {
    const { email, password } = validatedData.data;

    // 1. Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Usuario o contraseña incorrectos." };

    // 2. COMPARAR HASHEO
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Usuario o contraseña incorrectos." };

    // 3. GENERAR JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    // 4. GUARDAR EN COOKIE SEGURA
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hora
      path: "/",
    });
  } catch (error) {
    return { error: "Error en el servidor durante el login." };
  }

  redirect("/");
}


// ACCIONES DE PROPIEDADES (Properties)
export async function createPropertyAction(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const rawData = {
    title: formData.get("title"),
    address: formData.get("address"),
    price: formData.get("price"),
    userId: formData.get("userId"), 
  };

  const validatedData = PropertySchema.safeParse(rawData);

  if (!validatedData.success) {
    return { 
      error: "Datos inválidos en el formulario de Propiedades", 
      details: validatedData.error.flatten().fieldErrors 
    };
  }

  try {
    const newProperty = await prisma.property.create({ data: validatedData.data });
    return { success: true, data: newProperty };
  } catch (error) {
    return { error: "Error interno al guardar la propiedad en la base de datos." };
  }
}

// ACCIONES DE CONTRATOS DE ALQUILER (Leases)
export async function createLeaseAction(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const rawData = {
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    propertyId: formData.get("propertyId"), 
  };

  const validatedData = LeaseSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { 
      error: "Datos inválidos en el formulario de Contratos", 
      details: validatedData.error.flatten().fieldErrors 
    };
  }

  try {
    const newLease = await prisma.lease.create({ data: validatedData.data });
    return { success: true, data: newLease };
  } catch (error) {
    return { error: "Error interno al guardar el contrato en la base de datos." };
  }
}

 // ACCIONES DE PAGOS (Payments)

export async function createPaymentAction(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const rawData = {
    amount: formData.get("amount"),
    status: formData.get("status"),
    leaseId: formData.get("leaseId"), 
  };

  const validatedData = PaymentSchema.safeParse(rawData);

  if (!validatedData.success) {
    return { 
      error: "Datos inválidos en el formulario de Pagos", 
      details: validatedData.error.flatten().fieldErrors 
    };
  }

  try {
    const newPayment = await prisma.payment.create({ data: validatedData.data });
    return { success: true, data: newPayment };
  } catch (error) {
    return { error: "Error interno al guardar el pago en la base de datos." };
  }
}

export async function logOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/"); 
}