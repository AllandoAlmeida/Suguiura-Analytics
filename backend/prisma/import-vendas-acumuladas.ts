import 'dotenv/config';
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const arquivo = 'C:/Users/aland/Downloads/Vendas vendedores Suguiura MANO POZZA (2).xlsx';

const vendedores = [
  {
    aba: 'VENDEDOR "MANOEL" - 25',
    codigo: '195',
    lojaId: 1,
  },
  {
    aba: 'VENDEDOR "DAVI" 2025',
    codigo: '5555',
    lojaId: 1,
  },
];

const categoriasMap: Record<string, number> = {
  '1-MATERIAL BASICO': 1,
  '2-ESQUADRIAS': 2,
  '3-FERRAGENS E FERRAMENTAS': 3,
  '4-MAT. HIDRAULICO E METAIS': 4,
  '5-ELETRICA E ILUMINACAO': 5,
  '6-TINTAS E IMPERMEABILIZANTES': 6,
  '7-ACABAMENTO EM GERAL': 7,
  '8-PISOS, REVESTIMENTOS E PORCELANATOS': 8,
  '9-UD, JARDINAGEM E LAZER': 9,
  '11-ARGAMASSA E REJUNTES': 11,
};

const meses = [
  { mes: 1, coluna: 4, referenciaDia: 31 },
  { mes: 2, coluna: 7, referenciaDia: 28 },
  { mes: 3, coluna: 10, referenciaDia: 31 },
  { mes: 4, coluna: 13, referenciaDia: 30 },
  { mes: 5, coluna: 16, referenciaDia: 31 },
  { mes: 6, coluna: 19, referenciaDia: 30 },
  { mes: 7, coluna: 22, referenciaDia: 31 },
  { mes: 8, coluna: 25, referenciaDia: 31 },
  { mes: 9, coluna: 28, referenciaDia: 30 },
  { mes: 10, coluna: 31, referenciaDia: 31 },
  { mes: 11, coluna: 34, referenciaDia: 30 },
  { mes: 12, coluna: 37, referenciaDia: 31 },
];

function normalizarTexto(valor: unknown): string {
  return String(valor ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function numero(valor: unknown): number {
  if (typeof valor === 'number') return valor;

  if (!valor) return 0;

  return Number(
    String(valor)
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, ''),
  ) || 0;
}

async function importar() {
  const workbook = XLSX.readFile(arquivo);

  for (const config of vendedores) {
    const sheet = workbook.Sheets[config.aba];

    if (!sheet) {
      console.log(`Aba não encontrada: ${config.aba}`);
      continue;
    }

    const linhas = XLSX.utils.sheet_to_json<any[]>(sheet, {
      header: 1,
      raw: true,
    });

    const vendedor = await prisma.vendedor.findUnique({
      where: { codigo: config.codigo },
    });

    if (!vendedor) {
      console.log(`Vendedor não encontrado: ${config.codigo}`);
      continue;
    }

    // Linhas 6 a 15 da planilha, considerando índice zero: 5 a 14.
    for (let linhaIndex = 5; linhaIndex <= 14; linhaIndex++) {
      const linha = linhas[linhaIndex];

      if (!linha) continue;

      const nomeCategoria = normalizarTexto(linha[3]);
      const categoriaId = categoriasMap[nomeCategoria];

      if (!categoriaId) {
        console.log(`Categoria não mapeada: ${linha[0]}`);
        continue;
      }

      for (const itemMes of meses) {
        const valor = numero(linha[itemMes.coluna]);

        await prisma.vendaAcumulada.upsert({
          where: {
            lojaId_vendedorId_categoriaId_ano_mes_referenciaDia: {
              lojaId: config.lojaId,
              vendedorId: vendedor.id,
              categoriaId,
              ano: 2025,
              mes: itemMes.mes,
              referenciaDia: itemMes.referenciaDia,
            },
          },
          update: {
            valor,
          },
          create: {
            lojaId: config.lojaId,
            vendedorId: vendedor.id,
            categoriaId,
            ano: 2025,
            mes: itemMes.mes,
            referenciaDia: itemMes.referenciaDia,
            valor,
          },
        });
      }
    }

    console.log(`Importação concluída para vendedor ${vendedor.nome}`);
  }

  await prisma.$disconnect();
}

importar().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});