# ⚙️ SETUP.md — Ambiente Suguiura Analytics

## Objetivo
Este arquivo serve como instrução de laboratório para criação do ambiente do projeto Suguiura Analytics e também como base reutilizável para outros projetos.

---

## Stack do Projeto

- Backend principal: NestJS
- ORM: Prisma
- Banco de dados: PostgreSQL
- Microserviço de inteligência: FastAPI
- Frontend: Next.js
- Comunicação entre serviços: HTTP/REST

---

# 1. Banco de Dados — PostgreSQL

## 1.1 Criar banco

```sql
CREATE DATABASE suguiura_analytics;
```

## 1.2 String de conexão

Exemplo para o arquivo `.env` do backend NestJS:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/suguiura_analytics"
```

Substituir:

- `USER` pelo usuário do PostgreSQL
- `PASSWORD` pela senha
- `suguiura_analytics` pelo nome do banco, se for diferente

---

# 2. Backend Principal — NestJS + Prisma

## 2.1 Instalar NestJS CLI

```bash
npm i -g @nestjs/cli
```

## 2.2 Criar projeto backend

```bash
nest new backend
cd backend
```

## 2.3 Instalar Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

## 2.4 Rodar migration

```bash
npx prisma migrate dev --name init
```

## 2.5 Abrir Prisma Studio

```bash
npx prisma studio
```

## 2.6 Rodar backend

```bash
npm run start:dev
```

Backend padrão:

```text
http://localhost:3000
```

---

# 3. Schema Prisma — Base do Banco

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Loja {
  id     Int    @id
  nome   String
  tipo   String // REDE | LOJA

  vendedores        Vendedor[]
  vendasAcumuladas  VendaAcumulada[]
  vendasDiarias     VendaDiaria[]
  metas             Meta[]
}

model Vendedor {
  id        Int    @id @default(autoincrement())
  codigo    String @unique
  nome      String

  lojaAtualId Int
  lojaAtual   Loja @relation(fields: [lojaAtualId], references: [id])

  ativo Boolean @default(true)

  vendasAcumuladas VendaAcumulada[]
  vendasDiarias    VendaDiaria[]
  metas            Meta[]
}

model Categoria {
  id   Int    @id
  nome String

  vendasAcumuladas VendaAcumulada[]
  metas            Meta[]
}

model VendaAcumulada {
  id Int @id @default(autoincrement())

  lojaId      Int
  vendedorId  Int
  categoriaId Int

  ano Int
  mes Int
  referenciaDia Int

  valor Float

  loja      Loja      @relation(fields: [lojaId], references: [id])
  vendedor  Vendedor  @relation(fields: [vendedorId], references: [id])
  categoria Categoria @relation(fields: [categoriaId], references: [id])

  @@index([ano, mes, referenciaDia])
  @@unique([lojaId, vendedorId, categoriaId, ano, mes, referenciaDia])
}

model VendaDiaria {
  id Int @id @default(autoincrement())

  vendedorId Int
  lojaId     Int

  data DateTime

  valor        Float
  atendimentos Int
  devolucoes   Float
  itens        Int
  desconto     Float

  vendedor Vendedor @relation(fields: [vendedorId], references: [id])
  loja     Loja     @relation(fields: [lojaId], references: [id])

  @@unique([vendedorId, data])
}

model Meta {
  id Int @id @default(autoincrement())

  nivel String // REDE | LOJA | VENDEDOR

  lojaId      Int?
  vendedorId  Int?
  categoriaId Int?

  ano Int
  mes Int?

  tipo String // VALOR | PERCENTUAL

  valor      Float?
  percentual Float?

  baseAno Int?

  criadoEm DateTime @default(now())

  loja      Loja?      @relation(fields: [lojaId], references: [id])
  vendedor  Vendedor?  @relation(fields: [vendedorId], references: [id])
  categoria Categoria? @relation(fields: [categoriaId], references: [id])

  @@index([ano, mes, nivel])
}
```

---

# 4. Microserviço de Inteligência — FastAPI

## 4.1 Criar pasta

```bash
mkdir fastapi-service
cd fastapi-service
```

## 4.2 Criar ambiente virtual

```bash
python -m venv venv
```

## 4.3 Ativar ambiente virtual no Windows

```bash
venv\Scripts\activate
```

## 4.4 Instalar dependências

```bash
pip install fastapi uvicorn pandas psycopg2-binary python-dotenv
```

## 4.5 Criar arquivo `main.py`

```python
from fastapi import FastAPI

app = FastAPI(title="Suguiura Analytics Intelligence API")

@app.get("/")
def health_check():
    return {"status": "FastAPI rodando"}
```

## 4.6 Rodar FastAPI

```bash
uvicorn main:app --reload
```

Serviço padrão:

```text
http://localhost:8000
```

Documentação automática:

```text
http://localhost:8000/docs
```

---

# 5. Frontend — Next.js

## 5.1 Criar projeto

```bash
npx create-next-app@latest frontend
cd frontend
```

Recomendações:

- TypeScript: Yes
- Tailwind: Yes
- App Router: Yes

## 5.2 Instalar dependências

```bash
npm install axios recharts
```

## 5.3 Rodar frontend

```bash
npm run dev
```

Frontend padrão:

```text
http://localhost:3000
```

Observação: caso o backend NestJS esteja na porta 3000, configurar o Next.js para outra porta.

Exemplo:

```bash
npm run dev -- -p 3001
```

---

# 6. Comunicação entre Serviços

## Fluxo principal

```text
Frontend Next.js → Backend NestJS → FastAPI → PostgreSQL
```

## Responsabilidades

### NestJS

- API principal
- autenticação
- CRUD
- gestão de vendas
- gestão de metas
- comunicação com Prisma

### FastAPI

- projeções
- cálculos avançados
- inteligência comercial
- futura IA

---

# 7. Primeiro Endpoint de Inteligência

Exemplo conceitual no FastAPI:

```python
@app.get("/inteligencia/projecao/{vendedor_id}")
def calcular_projecao(vendedor_id: int):
    return {
        "vendedor_id": vendedor_id,
        "media_diaria": 2500,
        "projecao_mes": 75000
    }
```

---

# 8. Ordem Recomendada de Desenvolvimento

1. Criar backend NestJS
2. Configurar Prisma + PostgreSQL
3. Criar schema do banco
4. Criar CRUD base
5. Criar FastAPI
6. Criar comunicação NestJS → FastAPI
7. Criar dashboard Next.js
8. Importar dados da planilha
9. Criar relatórios BI
10. Evoluir para IA

---

# 9. Observação Final


Este arquivo deve ser utilizado como guia de setup e laboratório base para este e futuros projetos.
