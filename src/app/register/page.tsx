"use client"

import { useActionState } from "react";
import { registerAction } from "@/app/actions/db-actions";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
          {/* Top aesthetic bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-700 to-black"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Únete a RentVago</h1>
            <p className="text-gray-500">Crea tu cuenta profesional hoy</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                </div>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Tu nombre"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              {state?.details?.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{state.details.name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                </div>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              {state?.details?.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{state.details.email[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                </div>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              {state?.details?.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{state.details.password[0]}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
            >
              {isPending ? (
                "Creando cuenta..."
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Registrarse ahora
                </>
              )}
            </button>

            {state?.error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100 text-center">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="p-4 bg-green-50 text-green-700 text-xs font-bold rounded-2xl border border-green-100 text-center">
                ¡Registro exitoso! Ya puedes iniciar sesión.
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              ¿Ya tienes cuenta? {" "}
              <Link href="/login" className="font-bold text-black hover:underline underline-offset-4">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
