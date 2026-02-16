"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const categorias = [
  "Servicios",
  "Suministros",
  "Salarios",
  "Utilidades",
  "Transporte",
  "Otros",
];

export default function ExpenseTracker() {
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const { data: gastos = [], mutate } = useSWR("/api/gastos", fetcher);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion || !cantidad || !categoria) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion,
          cantidad: parseFloat(cantidad),
          categoria,
          fecha,
          documento,
        }),
      });

      if (response.ok) {
        setSuccess("Expense recorded successfully!");
        setDescripcion("");
        setCantidad("");
        setCategoria("");
        setDocumento("");
        setFecha(new Date().toISOString().split("T")[0]);
        mutate();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      alert("Error recording expense");
    } finally {
      setLoading(false);
    }
  };

  const totalGastos = gastos.reduce((sum: number, g: any) => sum + (g.cantidad || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">
            ${totalGastos.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Document</label>
              <input
                type="text"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Invoice or reference"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Recording..." : "Record Expense"}
            </button>
          </form>
        </div>

        {/* Lista de gastos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((gasto: any) => (
                    <tr key={gasto.id} className="border-t">
                      <td className="px-4 py-2">{gasto.descripcion}</td>
                      <td className="px-4 py-2">{gasto.categoria}</td>
                      <td className="px-4 py-2 text-red-600">
                        ${gasto.cantidad.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(gasto.fecha).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
