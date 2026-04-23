"use client";

import { useQueryState } from 'nuqs';

export default function Filters() {
  // nuqs vincula automáticamente estos estados con la URL (?query=...&minPrice=...)
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [minPrice, setMinPrice] = useQueryState('minPrice', { defaultValue: '' });

  return (
    <div className="flex flex-wrap gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Búsqueda</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Poblado, Apartamento..."
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="w-[200px]">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Mínimo</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Mín $"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>
  );
}
