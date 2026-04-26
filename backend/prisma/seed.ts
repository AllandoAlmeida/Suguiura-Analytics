import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.loja.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'Loja Cidade Líder',
    },
  });

  await prisma.loja.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nome: 'Loja Vila Matilde',
    },
  });

  const categorias = [
    { id: 1, nome: 'Material Básico' },
    { id: 2, nome: 'Esquadrias' },
    { id: 3, nome: 'Ferragens e Ferramentas' },
    { id: 4, nome: 'Mat. Hidráulico e Metais' },
    { id: 5, nome: 'Elétrica e Iluminação' },
    { id: 6, nome: 'Tintas e Impermeabilizantes' },
    { id: 7, nome: 'Acabamento em Geral' },
    { id: 8, nome: 'Pisos, Revestimentos e Porcelanatos' },
    { id: 9, nome: 'UD, Jardinagem e Lazer' },
    { id: 11, nome: 'Argamassa e Rejuntos' },
  ];

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { id: categoria.id },
      update: {
        nome: categoria.nome,
      },
      create: categoria,
    });
  }

  await prisma.vendedor.upsert({
    where: { codigo: '195' },
    update: {
      nome: 'Manoel',
      lojaAtualId: 1,
      ativo: true,
    },
    create: {
      codigo: '195',
      nome: 'Manoel',
      lojaAtualId: 1,
      ativo: true,
    },
  });

  await prisma.vendedor.upsert({
    where: { codigo: '5555' },
    update: {
      nome: 'Davi',
      lojaAtualId: 1,
      ativo: true,
    },
    create: {
      codigo: '5555',
      nome: 'Davi',
      lojaAtualId: 1,
      ativo: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed executado com sucesso.');
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });