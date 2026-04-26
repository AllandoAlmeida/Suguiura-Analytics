# Suguiura-Analytics
É um aplicativo de gestão comercial desenvolvido para a loja de materiais de construção Irmãos Suguiura, com o objetivo de centralizar e visualizar, por meio de dashboards interativos, a performance individual dos vendedores. O sistema transforma dados de vendas em informações estratégicas, permitindo acompanhar indicadores como faturamento, metas, volume de vendas, evolução por período e ranking de desempenho, facilitando a análise gerencial e apoiando decisões mais rápidas e orientadas por dados.

## 1. Objetivo

Sistema para gestão de metas, vendas e performance por vendedor, com
foco em indicadores estratégicos e tomada de decisão.

------------------------------------------------------------------------

## 2. Estrutura do Sistema

### Entidades

-   Usuários
-   Empresas
-   Vendedores
-   Metas Mensais
-   Vendas
-   Categorias
-   Vendas por Categoria
-   Configurações
-   Calendário

------------------------------------------------------------------------

## 3. Regras de Negócio

### KPIs

-   Ticket Médio = Valor / Clientes
-   Atingimento = Realizado / Meta
-   Desconto Médio = Desconto / Valor
-   Mix de Categoria (%)

### Índice de Eficiência (IEV)

Baseado em: - Meta atingida - Ticket médio - Desconto

------------------------------------------------------------------------

## 4. Metas Inteligentes

### Distribuição

-   Baseada em pesos por dia da semana
-   Considera feriados e dias fechados

### Recalculo Dinâmico

-   Atualização diária
-   Redistribuição da meta restante

### Projeções

-   Conservadora
-   Realista
-   Agressiva

------------------------------------------------------------------------

## 5. UX (Telas)

### Dashboard

-   Faturamento
-   Meta
-   Percentual
-   Gráficos
-   Ranking

### Vendedor

-   KPIs individuais
-   Meta diária
-   Evolução
-   Mix de vendas

### Lançamento

-   Registro de vendas
-   Categorias

------------------------------------------------------------------------

## 6. Arquitetura

-   Backend: API central
-   Frontend: Dashboard interativo
-   Banco: Estruturado para histórico de 5 anos

------------------------------------------------------------------------

## 7. Backlog

### EPICs

-   Autenticação
-   Cadastro
-   Vendas
-   Dashboard
-   Inteligência
-   Configurações

------------------------------------------------------------------------

## 8. Roadmap

### MVP

-   Cadastro
-   Vendas
-   Dashboard básico

### Evolução

-   Projeções
-   Ranking inteligente
-   Alertas

### Futuro

-   IA
-   Mobile
-   SaaS

------------------------------------------------------------------------



## 9. Observações

-   Sistema preparado para multiempresa
-   Estrutura escalável
-   Foco em análise e decisão

----------------------------------------------------------------------

# 📘 Suguiura-Analytics --- Documentação Oficial v3

------------------------------------------------------------------------

## Estrutura

-   Lojas
-   Vendedores
-   Performance Anual (Histórico)
-   Projeção
-   Vendas Diárias

------------------------------------------------------------------------

## Regras

-   Projeção baseada no ano anterior
-   Crescimento configurável
-   Recalculo em tempo real

------------------------------------------------------------------------

## Dashboard

-   Busca por código do vendedor
-   Indicadores principais
-   Gráficos de evolução

------------------------------------------------------------------------

## Arquitetura

-   Backend (API)
-   Frontend (Dashboard)
-   Banco (PostgreSQL)

------------------------------------------------------------------------

## Observações

Sistema preparado para SaaS e múltiplas lojas.

