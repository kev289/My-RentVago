import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative isolation px-6 pt-14 lg:px-8 overflow-hidden bg-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#000] to-[#666] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-6">
          Gestiona tus alquileres con <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">RentVago</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Plataforma interactiva para arrendadores y arrendatarios.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/register"
            className="rounded-full bg-black px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 group"
          >
            Empezar gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="text-lg font-semibold leading-6 text-gray-900 hover:text-gray-600 transition-colors">
            Iniciar sesión <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
