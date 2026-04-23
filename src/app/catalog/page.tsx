import { prisma } from "@/lib/db/prisma";
import PropertyCard from "./PropertyCard";
import Filters from "./Filters";

// Forzamos que Next.js siempre traiga datos frescos de la DB
export const dynamic = 'force-dynamic';

interface SearchParams {
  query?: string;
  minPrice?: string;
}

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  const params = await searchParams;
  
  // Consulta a Prisma con filtros de URL
  const properties = await prisma.property.findMany({
    where: {
      AND: [
        params.query ? {
          OR: [
            { title: { contains: params.query, mode: 'insensitive' } },
            { address: { contains: params.query, mode: 'insensitive' } },
          ]
        } : {},
        params.minPrice ? {
          price: { gte: parseFloat(params.minPrice) }
        } : {}
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">Descubre tu próximo hogar</h1>
          <p className="text-gray-500 text-lg">Encuentra los mejores arriendos verificados por RentVago.</p>
        </div>
      </div>
      
      <div className="mb-12">
        <Filters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
        
        {properties.length === 0 && (
          <div className="col-span-full text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-inner">
            <div className="text-6xl mb-4 text-gray-300 italic">"Pura soledad..."</div>
            <p className="text-gray-400 text-xl font-medium">No hay propiedades que coincidan con estos filtros.</p>
            <button className="mt-8 text-black font-bold underline">Limpiar todos los filtros</button>
          </div>
        )}
      </div>
    </main>
  );
}
