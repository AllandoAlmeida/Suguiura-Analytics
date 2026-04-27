"use client";
/* 
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/app/services/api';

api

type FaturamentoMensal = {
  mes: number;
  total: number;
};

export default function Dashboard() {
  const [data, setData] = useState<FaturamentoMensal[]>([]);

  useEffect(() => {
    
    api.get('/dashboard/faturamento-mensal?vendedorId=1')
      .then((res:any) => {
      console.log('DADOS:', res.data);
      setData(res.data);
    });
  
  }, []);
   
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Faturamento Mensal
      </h1>

      <div className="w-full max-w-5xl h-[400px] bg-white rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} */
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { api } from "@/app/services/api";

type FaturamentoMensal = {
  mes: number;
  total: number;
};

type CategoriaMes = {
  categoriaId: number;
  categoria: string;
  total: number;
  percentual: number;
};

type MetaResumo = {
  realizado: number;
  meta: number;
  atingido: number;
  projecao: number;
};

type Ranking = {
  vendedorId: number;
  vendedor: string;
  total: number;
};

const vendedorId = 1;
const ano = 2026;
const mes = 4;

export default function Dashboard() {
  const [faturamento, setFaturamento] = useState<FaturamentoMensal[]>([]);
  const [categorias, setCategorias] = useState<CategoriaMes[]>([]);
  const [meta, setMeta] = useState<MetaResumo | null>(null);
  const [ranking, setRanking] = useState<Ranking[]>([]);

  useEffect(() => {
    async function carregarDashboard() {
      const [
        faturamentoResponse,
        categoriasResponse,
        metaResponse,
        rankingResponse,
      ] = await Promise.all([
        api.get(`/dashboard/faturamento-mensal?vendedorId=${vendedorId}`),
        api.get(`/dashboard/categorias?vendedorId=${vendedorId}&mes=${mes}`),
        api.get(
          `/dashboard/meta?vendedorId=${vendedorId}&mes=${mes}&ano=${ano}`,
        ),
        api.get(`/dashboard/ranking?mes=${mes}`),
      ]);

      setFaturamento(faturamentoResponse.data);
      setCategorias(categoriasResponse.data);
      setMeta(metaResponse.data);
      setRanking(rankingResponse.data);
    }

    carregarDashboard();
  }, []);

  const coresCategoria: Record<number, string> = {
    1: "#2563eb", // azul
    2: "#16a34a", // verde
    3: "#f59e0b", // amarelo
    4: "#ef4444", // vermelho
    5: "#8b5cf6", // roxo
    6: "#06b6d4", // ciano
    7: "#84cc16", // lime
    8: "#f97316", // laranja
    9: "#ec4899", // pink
    10: "#14b8a6", // teal
    11: "#eab308", // gold
  };

  

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Comercial</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card titulo="Realizado" valor={formatarMoeda(meta?.realizado ?? 0)} />

        <Card titulo="Meta" valor={formatarMoeda(meta?.meta ?? 0)} />

        <Card titulo="Atingido" valor={`${meta?.atingido ?? 0}%`} />

        <Card titulo="Projeção" valor={formatarMoeda(meta?.projecao ?? 0)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white text-zinc-900 rounded-2xl p-4">
          <h2 className="font-bold mb-4">Faturamento Mensal</h2>

          <div className="h-90">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={faturamento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => formatarMoeda(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white text-zinc-900 rounded-2xl p-4">
          <h2 className="font-bold mb-4">Mix de Categorias</h2>

          <div className="h-[360px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              /* border="1px solid red" */
            >
              <PieChart>
                <Pie
                  data={categorias}
                  dataKey="total"
                  nameKey="categoria"
                  outerRadius={120}
                  label={(item: any) => `(${item.percentual.toFixed(2)}%)`}
                >
                  {categorias.map((item) => (
                    <Cell
                      key={item.categoriaId}
                      fill={coresCategoria[item.categoriaId] || "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    formatarMoeda(Number(value)),
                    props.payload.categoria,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white text-zinc-900 rounded-2xl p-4">
          <h2 className="font-bold mb-4">Categorias por Valor</h2>

          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorias}>
                <CartesianGrid strokeDasharray="3 3" />
                
                <XAxis dataKey="categoriaId" />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) => [
                    formatarMoeda(Number(value)),
                    props.payload.categoria,
                  ]}
                />
                <Bar dataKey="total">
                  {categorias.map((item) => (
                    <Cell
                      key={item.categoriaId}
                      fill={coresCategoria[item.categoriaId] || "#9ca3af"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white text-zinc-900 rounded-2xl p-4">
          <h2 className="font-bold mb-4">Ranking de Vendedores</h2>

          <div className="space-y-3">
            {ranking.map((item, index) => (
              <div
                key={item.vendedorId}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {index + 1}º {item.vendedor}
                </span>

                <strong>{formatarMoeda(item.total)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-white text-zinc-900 rounded-2xl p-4 shadow">
      <p className="text-sm text-zinc-500">{titulo}</p>
      <strong className="text-2xl">{valor}</strong>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
