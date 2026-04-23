export default function PropertyCard({ property }: { property: any }) {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden border-2 border-transparent hover:border-black/5">
      <div className="aspect-video relative overflow-hidden bg-gray-200">
        {property.image ? (
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
             🖼️ Sin imagen disponible
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-2xl">
          ${Number(property.price).toLocaleString()} / mes
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
          {property.title}
        </h3>
        <p className="text-gray-500 text-sm flex items-center gap-2 mb-6">
          <span className="opacity-70">📍</span> {property.address}
        </p>
        
        <button className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-black/5">
            Reservar ahora
        </button>
      </div>
    </div>
  );
}
