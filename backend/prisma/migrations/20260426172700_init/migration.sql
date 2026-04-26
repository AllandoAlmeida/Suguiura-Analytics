-- CreateEnum
CREATE TYPE "TipoNivelMeta" AS ENUM ('REDE', 'LOJA', 'VENDEDOR');

-- CreateEnum
CREATE TYPE "TipoDefinicaoMeta" AS ENUM ('VALOR', 'PERCENTUAL');

-- CreateTable
CREATE TABLE "Loja" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "lojaAtualId" INTEGER NOT NULL,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendaAcumulada" (
    "id" SERIAL NOT NULL,
    "lojaId" INTEGER NOT NULL,
    "vendedorId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "referenciaDia" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VendaAcumulada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendaDiaria" (
    "id" SERIAL NOT NULL,
    "vendedorId" INTEGER NOT NULL,
    "lojaId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "atendimentos" INTEGER NOT NULL,
    "devolucoes" DOUBLE PRECISION NOT NULL,
    "itens" INTEGER NOT NULL,
    "desconto" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VendaDiaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meta" (
    "id" SERIAL NOT NULL,
    "nivel" "TipoNivelMeta" NOT NULL,
    "tipo" "TipoDefinicaoMeta" NOT NULL,
    "lojaId" INTEGER,
    "vendedorId" INTEGER,
    "categoriaId" INTEGER,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER,
    "valor" DOUBLE PRECISION,
    "percentual" DOUBLE PRECISION,
    "baseAno" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendedor_codigo_key" ON "Vendedor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE INDEX "VendaAcumulada_ano_mes_referenciaDia_idx" ON "VendaAcumulada"("ano", "mes", "referenciaDia");

-- CreateIndex
CREATE UNIQUE INDEX "VendaAcumulada_lojaId_vendedorId_categoriaId_ano_mes_refere_key" ON "VendaAcumulada"("lojaId", "vendedorId", "categoriaId", "ano", "mes", "referenciaDia");

-- CreateIndex
CREATE UNIQUE INDEX "VendaDiaria_vendedorId_data_key" ON "VendaDiaria"("vendedorId", "data");

-- CreateIndex
CREATE INDEX "Meta_ano_mes_nivel_idx" ON "Meta"("ano", "mes", "nivel");

-- AddForeignKey
ALTER TABLE "Vendedor" ADD CONSTRAINT "Vendedor_lojaAtualId_fkey" FOREIGN KEY ("lojaAtualId") REFERENCES "Loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaAcumulada" ADD CONSTRAINT "VendaAcumulada_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaAcumulada" ADD CONSTRAINT "VendaAcumulada_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaAcumulada" ADD CONSTRAINT "VendaAcumulada_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaDiaria" ADD CONSTRAINT "VendaDiaria_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendaDiaria" ADD CONSTRAINT "VendaDiaria_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
