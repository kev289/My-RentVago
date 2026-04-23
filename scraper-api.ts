import Fastify from 'fastify';
import * as cheerio from 'cheerio';
import { prisma } from './src/lib/db/prisma';

const fastify = Fastify({ logger: true });

fastify.get('/scrape-and-save', async (request, reply) => {
  try {
    const response = await fetch('https://logic-rentals-demo.vercel.app/'); 
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extraemos los datos de forma simple
    const fetchedItems: any[] = $('article').map((i, el) => ({
      title: $(el).find('h2').text() || $(el).find('h3').text(),
      address: $(el).find('.address').text() || $(el).find('p').first().text(),
      image: $(el).find('img').attr('src')
    })).get();

    // Si la web no trajo nada, creamos nuestros propios datos Pro
    const rawProperties = fetchedItems.length > 0 && fetchedItems[0].title ? fetchedItems : [
      { 
        title: "Penthouse de Lujo Poblado", 
        address: "Carrera 34 #10-50, Medellín", 
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200" 
      },
      { 
        title: "Cabaña Moderna Envigado", 
        address: "Vereda Las Palmas, Antioquia", 
        image: "https://images.unsplash.com/photo-1600585154340-be6199f7f009?auto=format&fit=crop&w=1200" 
      }
    ];

    const saved = [];
    for (let i = 0; i < rawProperties.length; i++) {
      const p = rawProperties[i];
      
      const user = await prisma.user.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, email: 'admin@rentvago.com', password: 'password123', name: 'Admin' }
      });

      const newP = await prisma.property.create({
        data: {
          title: p.title || "Propiedad Premium",
          address: p.address || "Medellín",
          price: (2000000 + (i * 500000)).toString() as any,
          image: p.image || "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=1200",
          userId: user.id
        }
      });
      saved.push(newP);
    }

    return { status: "success", count: saved.length };
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Error en el servidor" });
  }
});

fastify.listen({ port: 4000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Scraper Pro en ${address}`);
});
