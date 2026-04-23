import { PrismaClient } from '@prisma/client'

// ELIMINAMOS cualquier objeto de configuración del constructor
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding...');

  await prisma.property.deleteMany({});
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@rentvago.com' },
    update: {},
    create: {
      email: 'admin@rentvago.com',
      password: 'password123',
      name: 'Admin RentVago',
    },
  })

  await prisma.property.createMany({
    data: [
      {
        title: 'Apartamento de Lujo en El Poblado',
        address: 'Carrera 43A, Medellín',
        description: 'Hermosa vista y acabados de lujo.',
        price: 3500000,
        userId: user.id
      },
      {
        title: 'Casa Campestre en Envigado',
        address: 'Loma del Escobero',
        description: 'Ideal para familias grandes.',
        price: 5200000,
        userId: user.id
      }
    ]
  })

  console.log('✅ Base de datos poblada!');
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
