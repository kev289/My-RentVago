import axios from 'axios';
import { prisma } from '../../lib/db/prisma';

// Cargamos el token desde el archivo .env
const APIFY_TOKEN = process.env.APIFY_TOKEN; 

if (!APIFY_TOKEN) {
  throw new Error("Error: No se encontro la variable APIFY_TOKEN en el archivo .env");
}

const API_URL = `https://api.apify.com/v2/acts/apify~facebook-marketplace-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

async function runScraper() {
  console.log('Conectando con la API de Apify para Marketplace...');

  try {
    // Definimos el input requerido por el Actor de Facebook
    const input = {
      "startUrls": [
        { "url": "https://www.facebook.com/marketplace/medellin/propertyrentals" }
      ],
      "maxItems": 10
    };

    // Llamada sincrona a la API
    const response = await axios.post(API_URL, input);
    const items = response.data;

    console.log(`Apify devolvio ${items.length} resultados.`);

    for (const item of items) {
      // Registrar usuario administrador si no existe
      const user = await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: { 
          id: 1, 
          email: 'admin@rentvago.com', 
          password: 'password123', 
          name: 'Admin' 
        }
      });

      // Mapeo de datos para la base de datos local
      await prisma.property.create({
        data: {
          title: item.title || "Propiedad de Marketplace",
          address: item.location || "Medellin, Antioquia",
          // El precio puede venir como Numero o String con simbolos
          price: (item.price || 2000000).toString().replace(/[^0-9]/g, ''),
          image: item.image || item.imageUrl || item.thumbnail || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
          userId: user.id
        }
      });
    }

    console.log('Proceso finalizado. Base de datos actualizada con datos de Facebook.');

  } catch (error: any) {
    console.error('Error durante la ejecucion:', error.response?.data || error.message);
  }
}

runScraper();
