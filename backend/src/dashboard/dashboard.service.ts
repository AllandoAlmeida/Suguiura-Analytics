import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const totalVendas = await this.prisma.vendaAcumulada.count();

    return {
      status: 'success',
      module: 'dashboard',
      totalVendasAcumulado: totalVendas,
    };
  }

  async getFaturamentoMensal(vendedorId: number) {
    const resultado = await this.prisma.$queryRaw<
      { mes: number; total: number }[]
    >`
        SELECT 
        mes,
        SUM(valor) as total
        FROM "VendaAcumulada"
        WHERE "vendedorId" = ${vendedorId}
        GROUP BY mes
        ORDER BY mes
    `;

    return resultado;
  }

  async getCategoriasPorMes(vendedorId: number, mes: number) {
    const resultado = await this.prisma.$queryRaw<
      {
        categoriaId: number;
        categoria: string;
        total: number;
        percentual: number;
      }[]
    >`
    SELECT 
      c.id AS "categoriaId",
      c.nome AS categoria,
      ROUND(SUM(v.valor)::numeric, 2)::float AS total,
      ROUND(
        (SUM(v.valor) * 100.0 / SUM(SUM(v.valor)) OVER ())::numeric,
        2
      )::float AS percentual
    FROM "VendaAcumulada" v
    JOIN "Categoria" c ON c.id = v."categoriaId"
    WHERE 
      v."vendedorId" = ${vendedorId}
      AND v.mes = ${mes}
    GROUP BY c.id, c.nome
    ORDER BY c.id
  `;

    return resultado;
  }

  async getRanking(mes: number) {
    const resultado = await this.prisma.$queryRaw<
      { vendedorId: number; vendedor: string; total: number }[]
    >`
    SELECT 
      v."vendedorId",
      ve.nome AS vendedor,
      ROUND(SUM(v.valor)::numeric, 2)::float AS total
    FROM "VendaAcumulada" v
    JOIN "Vendedor" ve ON ve.id = v."vendedorId"
    WHERE v.mes = ${mes}
    GROUP BY v."vendedorId", ve.nome
    ORDER BY total DESC
  `;

    return resultado;
  }

  async getEvolucaoCategoria(vendedorId: number, categoriaId: number) {
    const resultado = await this.prisma.$queryRaw<
      { mes: number; categoriaId: number; categoria: string; total: number }[]
    >`
    SELECT 
      v.mes,
      c.id AS "categoriaId",
      c.nome AS categoria,
      ROUND(SUM(v.valor)::numeric, 2)::float AS total
    FROM "VendaAcumulada" v
    JOIN "Categoria" c ON c.id = v."categoriaId"
    WHERE 
      v."vendedorId" = ${vendedorId}
      AND v."categoriaId" = ${categoriaId}
    GROUP BY v.mes, c.id, c.nome
    ORDER BY v.mes
  `;

    return resultado;
  }

  private contarDiasUteis(ano: number, mes: number) {
    const ultimoDia = new Date(ano, mes, 0).getDate();
    let diasUteis = 0;

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const domingo = data.getDay() === 0;

      if (!domingo) {
        diasUteis++;
      }
    }

    return diasUteis;
  }

  private contarDiasUteisCorridos(ano: number, mes: number) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const ultimoDiaConsiderado =
      ano === anoAtual && mes === mesAtual
        ? hoje.getDate() - 1
        : new Date(ano, mes, 0).getDate();

    let diasUteisCorridos = 0;

    for (let dia = 1; dia <= ultimoDiaConsiderado; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const domingo = data.getDay() === 0;

      if (!domingo) {
        diasUteisCorridos++;
      }
    }

    return diasUteisCorridos;
  }

  async getMeta(vendedorId: number, mes: number, ano: number) {
    const realizadoResult = await this.prisma.$queryRaw<
      { realizado: number }[]
    >`
    SELECT 
      COALESCE(ROUND(SUM(valor)::numeric, 2)::float, 0) AS realizado
    FROM "VendaAcumulada"
    WHERE 
      "vendedorId" = ${vendedorId}
      AND mes = ${mes}
      AND ano = ${ano}
  `;

    const metaResult = await this.prisma.$queryRaw<{ meta: number }[]>`
    SELECT 
      COALESCE(ROUND(SUM(valor)::numeric, 2)::float, 0) AS meta
    FROM "Meta"
    WHERE 
      "vendedorId" = ${vendedorId}
      AND mes = ${mes}
      AND ano = ${ano}
  `;

    const realizado = realizadoResult[0]?.realizado ?? 0;
    const meta = metaResult[0]?.meta ?? 0;

    const diasUteisMes = this.contarDiasUteis(ano, mes);
    const diasUteisCorridos = this.contarDiasUteisCorridos(ano, mes);

    const atingido = meta > 0 ? realizado / meta : 0;

    const projecao =
      diasUteisCorridos > 0
        ? (realizado / diasUteisCorridos) * diasUteisMes
        : 0;

    return {
      vendedorId,
      ano,
      mes,
      realizado,
      meta,
      atingido: Number((atingido * 100).toFixed(2)),
      projecao: Number(projecao.toFixed(2)),
      diasUteisCorridos,
      diasUteisMes,
    };
  }

  private contarDiasUteisMes(ano: number, mes: number) {
    const ultimoDia = new Date(ano, mes, 0).getDate();
    let diasUteis = 0;

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const data = new Date(ano, mes - 1, dia);

      // Domingo = 0
      if (data.getDay() !== 0) {
        diasUteis++;
      }
    }

    return diasUteis;
  }

  async getProjecaoInteligente(vendedorId: number, mes: number, ano: number) {
    const anoAnterior = ano - 1;

    const realizadoAtualResult = await this.prisma.$queryRaw<
      { total: number }[]
    >`
    SELECT COALESCE(SUM(valor), 0) AS total
    FROM "VendaAcumulada"
    WHERE 
      "vendedorId" = ${vendedorId}
      AND mes = ${mes}
      AND ano = ${ano}
  `;

    const realizadoAnoAnteriorResult = await this.prisma.$queryRaw<
      { total: number }[]
    >`
    SELECT COALESCE(SUM(valor), 0) AS total
    FROM "VendaAcumulada"
    WHERE 
      "vendedorId" = ${vendedorId}
      AND mes = ${mes}
      AND ano = ${anoAnterior}
  `;

    const realizadoAtual = realizadoAtualResult[0]?.total ?? 0;
    const realizadoAnoAnterior = realizadoAnoAnteriorResult[0]?.total ?? 0;

    const diasUteisMesAtual = this.contarDiasUteisMes(ano, mes);
    const diasUteisMesAnoAnterior = this.contarDiasUteisMes(anoAnterior, mes);

    // Como sua VendaAcumulada atual tem referenciaDia,
    // usamos o maior referenciaDia lançado para descobrir até onde o mês atual foi informado.
    const referenciaAtualResult = await this.prisma.$queryRaw<
      { referenciaDia: number }[]
    >`
    SELECT COALESCE(MAX("referenciaDia"), 0) AS "referenciaDia"
    FROM "VendaAcumulada"
    WHERE 
      "vendedorId" = ${vendedorId}
      AND mes = ${mes}
      AND ano = ${ano}
  `;

    const referenciaDiaAtual = referenciaAtualResult[0]?.referenciaDia ?? 0;

    let diasUteisCorridosAtual = 0;

    for (let dia = 1; dia <= referenciaDiaAtual; dia++) {
      const data = new Date(ano, mes - 1, dia);

      if (data.getDay() !== 0) {
        diasUteisCorridosAtual++;
      }
    }

    const mediaDiaUtilAnoAnterior =
      diasUteisMesAnoAnterior > 0
        ? realizadoAnoAnterior / diasUteisMesAnoAnterior
        : 0;

    const baseProporcionalAnoAnterior =
      mediaDiaUtilAnoAnterior * diasUteisCorridosAtual;

    const indiceComparativo =
      baseProporcionalAnoAnterior > 0
        ? realizadoAtual / baseProporcionalAnoAnterior
        : 0;

    const variacaoPercentual = indiceComparativo - 1;

    const mediaDiaUtilAtual =
      diasUteisCorridosAtual > 0 ? realizadoAtual / diasUteisCorridosAtual : 0;

    const projecaoFechamento = mediaDiaUtilAtual * diasUteisMesAtual;

    return {
      vendedorId,
      ano,
      mes,
      anoAnterior,
      realizadoAtual: Number(realizadoAtual.toFixed(2)),
      realizadoAnoAnterior: Number(realizadoAnoAnterior.toFixed(2)),
      diasUteisCorridosAtual,
      diasUteisMesAtual,
      diasUteisMesAnoAnterior,
      mediaDiaUtilAnoAnterior: Number(mediaDiaUtilAnoAnterior.toFixed(2)),
      baseProporcionalAnoAnterior: Number(
        baseProporcionalAnoAnterior.toFixed(2),
      ),
      indiceComparativo: Number((indiceComparativo * 100).toFixed(2)),
      variacaoPercentual: Number((variacaoPercentual * 100).toFixed(2)),
      projecaoFechamento: Number(projecaoFechamento.toFixed(2)),
    };
  }
}
