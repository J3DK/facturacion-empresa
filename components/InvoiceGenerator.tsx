"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InvoiceGenerator() {
  const { data: clientes = [] } = useSWR("/api/clientes", fetcher);
  const { data: productos = [] } = useSWR("/api/productos", fetcher);
  
  const [clienteId, setClienteId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const addItem = () => {
    if (!selectedProduct) return;
    
    const producto = productos.find((p: any) => p.id === selectedProduct);
    if (!producto) return;

    const item = {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: parseInt(cantidad),
      precioUnitario: producto.precioUnitario,
    };

    setItems([...items, item]);
    setSelectedProduct("");
    setCantidad(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
  };

  const subtotal = calcularSubtotal();
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId || items.length === 0) {
      alert("Please select a client and add items");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const response = await fetch("/api/facturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId,
          items,
          fecha: new Date(),
          notas,
        }),
      });

      if (response.ok) {
        setSuccess("Invoice created successfully!");
        setClienteId("");
        setItems([]);
        setNotas("");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      alert("Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Generate Invoice</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium mb-2">Client</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clientes.map((cliente: any) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Agregar items */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Items</h3>
          
          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select product</option>
              {productos.map((producto: any) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - ${producto.precioUnitario}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-20 px-4 py-2 border border-gray-300 rounded-lg"
            />
            
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* Lista de items */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Product</th>
                  <th className="px-4 py-2 text-left text-sm">Qty</th>
                  <th className="px-4 py-2 text-left text-sm">Price</th>
                  <th className="px-4 py-2 text-left text-sm">Subtotal</th>
                  <th className="px-4 py-2 text-left text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{item.nombre}</td>
                    <td className="px-4 py-2">{item.cantidad}</td>
                    <td className="px-4 py-2">${item.precioUnitario.toFixed(2)}</td>
                    <td className="px-4 py-2">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>IVA (16%):</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t pt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
}
