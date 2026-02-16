"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());

  const { data: facturas = [] } = useSWR("/api/facturas", fetcher);
  const { data: gastos = [] } = useSWR(
    `/api/gastos?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
    fetcher
  );

  const totalIngresos = facturas.reduce((sum: number, f: any) => sum + (f.totalFinal || 0), 0);
  const totalGastos = gastos.reduce((sum: number, g: any) => sum + (g.cantidad || 0), 0);
  const ganancia = totalIngresos - totalGastos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome {session?.user?.name || session?.user?.email}</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Ingresos</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalIngresos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Gastos</p>
          <p className="text-3xl font-bold text-red-600">
            ${totalGastos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Ganancia Neta</p>
          <p className={`text-3xl font-bold ${ganancia >= 0 ? "text-blue-600" : "text-red-600"}`}>
            ${ganancia.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Últimas facturas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Últimas Facturas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Factura</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Cliente</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Monto</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {facturas.slice(0, 5).map((factura: any) => (
                <tr key={factura.id} className="border-t">
                  <td className="px-4 py-2">{factura.numeroFactura}</td>
                  <td className="px-4 py-2">{factura.cliente?.nombre}</td>
                  <td className="px-4 py-2">${factura.totalFinal.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      factura.estado === "pagada" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {factura.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
