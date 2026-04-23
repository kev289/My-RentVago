import Link from "next/link";
import { LogIn, UserPlus, Home, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { logOutAction } from "@/app/actions/db-actions";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.png" alt="RentVago Logo" width={56} height={56} className="w-14 h-14 object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">RentVago</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!token ? (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
                
                <Link 
                  href="/register" 
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            ) : (
              <form action={logOutAction}>
                <button 
                  type="submit"
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
