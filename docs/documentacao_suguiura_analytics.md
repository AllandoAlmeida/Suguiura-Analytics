# 📘 Suguiura Analytics --- Documentação Consolidada


## Objetivo
O Suguiura Analytics é um sistema de gestão comercial com foco em Business Intelligence, criado para acompanhar vendas, metas, projeções e performance por vendedor, loja, categoria e rede.

A arquitetura foi atualizada para um modelo híbrido, combinando NestJS, Prisma, PostgreSQL, FastAPI e Next.js.

---

# 1. Arquitetura Híbrida

## Visão geral

```text
Frontend Next.js
      ↓
Backend Principal NestJS
      ↓
Microserviço de Inteligência FastAPI
      ↓
PostgreSQL
```

---

# 2. Backend Principal — NestJS

## Responsabilidades

O backend principal será responsável por:

- autenticação
- usuários
- vendedores
- lojas
- categorias
- vendas acumuladas
- vendas diárias
- metas
- dashboards
- comunicação com o banco via Prisma
- comunicação com o FastAPI quando houver necessidade de inteligência avançada

---

# 3. Microserviço de Inteligência — FastAPI

## Responsabilidades

O FastAPI será usado para:

- projeção de vendas
- sugestão de metas
- análise histórica
- comparação de períodos
- cálculos estatísticos
- futura inteligência artificial

## Justificativa

Python é mais adequado para análise de dados, cálculos avançados e IA, principalmente com bibliotecas como Pandas, NumPy e futuramente modelos de machine learning.

---

# 4. Frontend — Next.js

## Responsabilidades

O frontend será responsável por:

- login
- dashboard visual
- filtros por período
- listagem de vendedores
- relatórios
- gráficos de categorias
- comparação histórica
- visualização de metas

---

# 5. Banco de Dados — PostgreSQL + Prisma

## Entidades principais

- Loja
- Vendedor
- Categoria
- VendaAcumulada
- VendaDiaria
- Meta

---

# 6. Conceito de Dados

## VendaAcumulada

Usada para BI.

Armazena o valor acumulado mensal por:

- loja
- vendedor
- categoria
- ano
- mês
- referência do dia

Exemplo:

```text
Abril de 2026 até o dia 18
```

## VendaDiaria

Usada para operação diária.

Armazena dados dia a dia:

- valor vendido
- atendimentos
- devoluções
- quantidade de itens
- desconto

## Regra importante

Dados acumulados e dados diários não devem ser misturados.

---

# 7. Lojas

## Estrutura

- 0 — Rede Suguiura
- 1 — Loja Cidade Líder
- 2 — Loja Vila Matilde

## Regra

A rede não deve ser usada como fonte primária de venda. A rede deve ser calculada pela soma das lojas.

---

# 8. Categorias

Categorias fixas:

1. Material Básico
2. Esquadrias
3. Ferragens e Ferramentas
4. Mat. Hidráulico e Metais
5. Elétrica e Iluminação
6. Tintas e Impermeabilizantes
7. Acabamento em Geral
8. Piso, Revestimentos e Porcelanatos
9. UD, Jardinagem e Lazer
11. Argamassa e Rejuntos

---

# 9. Vendedores

## Regras

- cada vendedor possui um id interno
- cada vendedor possui um código único
- o código será usado como base de pesquisa no dashboard
- o código não muda
- vendedor pode mudar de loja
- histórico permanece associado ao vendedor
- vendedor pode ser desativado
- vendedor nunca deve ser excluído

## Vendas sem vendedor

Vendas sem vendedor serão tratadas na importação como um vendedor especial, por exemplo: `VENDA LOJA`.

---

# 10. Metas

## Tipos de meta

- valor
- percentual

## Níveis de meta

- rede
- loja
- vendedor

## Período

- anual
- mensal

## Rateio por categoria

Quando uma meta for definida por valor, o sistema deve ratear nas categorias com base na participação das categorias no mesmo mês do ano anterior.

Exemplo:

```text
Meta Maio 2026 = R$ 100.000
Base Maio 2025:
Material Básico = 40%
Elétrica = 30%
Tintas = 30%
```

Resultado:

```text
Material Básico = R$ 40.000
Elétrica = R$ 30.000
Tintas = R$ 30.000
```

---

# 11. Business Intelligence

## Comparações necessárias

- mês atual vs mesmo mês do ano anterior
- mês atual até o dia X vs mesmo mês do ano anterior até o dia X
- categoria atual vs mesma categoria em anos anteriores
- loja atual vs loja em anos anteriores
- vendedor atual vs histórico do próprio vendedor

## Regras BI

- sempre usar o mesmo `referenciaDia` em comparações parciais
- nunca somar vários acumulados do mesmo mês
- sempre considerar o último acumulado válido
- histórico deve ser preservado

---

# 12. Dashboard

## Indicadores principais

- venda acumulada
- percentual de cumprimento da meta
- projeção de fechamento
- ticket médio diário
- ranking de vendedores
- venda por categoria
- comparação histórica

## Ticket médio

```text
Ticket médio = venda do dia / atendimentos efetivados
```

---

# 13. Comunicação NestJS → FastAPI

## Fluxo

1. Frontend solicita dados ao NestJS
2. NestJS busca dados no PostgreSQL via Prisma
3. Se necessário, NestJS chama o FastAPI
4. FastAPI calcula projeções ou sugestões
5. NestJS retorna o resultado consolidado para o frontend

---

# 14. Primeiro Endpoint de Inteligência

## Objetivo

Criar um endpoint no FastAPI para calcular projeção de venda.

Entrada:

- vendedor
- mês
- ano
- venda acumulada
- dias decorridos
- dias do mês

Saída:

- média diária
- projeção do mês
- status da meta

---

# 15. Ordem de Desenvolvimento

1. Criar projeto NestJS
2. Configurar Prisma + PostgreSQL
3. Implementar schema do banco
4. Criar CRUDs base
5. Criar FastAPI
6. Criar comunicação NestJS → FastAPI
7. Criar primeiro endpoint de inteligência
8. Criar frontend Next.js
9. Criar dashboard
10. Criar importação da planilha
11. Evoluir para IA

---

# 16. Status Atual

Projeto em fase de documentação e definição de arquitetura.

Próximos focos:

- montar arquitetura híbrida detalhada
- criar comunicação NestJS → FastAPI
- definir primeiro endpoint de inteligência
