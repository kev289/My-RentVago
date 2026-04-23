"use client"

import { useActionState } from "react";
import { loginAction } from "@/app/actions/db-actions";
import { LogIn, Mail, Lock, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

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
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-300 to-gray-500"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-500">Ingresa a tu panel de control</p>
          </div>

          <form action={formAction} className="space-y-5">
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
                "Verificando..."
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Acceder
                </>
              )}
            </button>

            {state?.error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100 text-center">
                {state.error}
              </div>
            )}

            {/* Hint for JWT testing during practice */}
            {state?.success && state?.data?.token && (
              <div className="mt-6 p-4 bg-gray-900 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-black uppercase tracking-widest">JWT Generado con éxito</span>
                </div>
                <div className="bg-black p-2 rounded-lg break-all">
                  <code className="text-[10px] text-gray-400 font-mono leading-tight">
                    {state.data.token.substring(0, 50)}...
                  </code>
                </div>
                <p className="text-[9px] text-gray-500 mt-2 italic text-center">
                  (En el examen, este token lo guardarías en una Cookie)
                </p>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              ¿No tienes cuenta? {" "}
              <Link href="/register" className="font-bold text-black hover:underline underline-offset-4">
                Regístrate gratis
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
