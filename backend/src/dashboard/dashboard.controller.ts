import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get('faturamento-mensal')
  getFaturamentoMensal(@Query('vendedorId') vendedorId: string) {
    return this.dashboardService.getFaturamentoMensal(Number(vendedorId));
  }

  @Get('categorias')
  getCatogoriasPorMes(
    @Query('vendedorId') vendedorId: string,
    @Query('mes') mes: string,
  ) {
    return this.dashboardService.getCategoriasPorMes(
      Number(vendedorId),
      Number(mes),
    );
  }

  @Get('ranking')
  getRanking(@Query('mes') mes: string) {
    return this.dashboardService.getRanking(Number(mes));
  }

  @Get('evolucao-categoria')
  getEvolucaoCategoria(
    @Query('vendedorId') vendedorId: string,
    @Query('categoriaId') categoriaId: string,
  ) {
    return this.dashboardService.getEvolucaoCategoria(
      Number(vendedorId),
      Number(categoriaId),
    );
  }

  @Get('meta')
  getMeta(
    @Query('vendedorId') vendedorId: string,
    @Query('mes') mes: string,
    @Query('ano') ano: string,
  ) {
    return this.dashboardService.getMeta(
      Number(vendedorId),
      Number(mes),
      Number(ano),
    );
  }

  @Get('projecao-inteligente')
  getProjecaoInteligente(
    @Query('vendedorId') vendedorId: string,
    @Query('mes') mes: string,
    @Query('ano') ano: string,
  ) {
    return this.dashboardService.getProjecaoInteligente(
      Number(vendedorId),
      Number(mes),
      Number(ano),
    );
  }
}
