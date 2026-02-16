export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center mb-12 text-white">
        <h1 className="text-5xl font-bold mb-4">Factura Pro</h1>
        <p className="text-xl text-blue-100">Professional Invoicing & Expense Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign In</h2>
          <p className="text-gray-600 mb-4">Access your existing account</p>
          <Link href="/auth/login" className="w-full block px-6 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Account</h2>
          <p className="text-gray-600 mb-4">Start managing your invoices today</p>
          <Link href="/auth/register" className="w-full block px-6 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition">
            Create Account
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-white">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-bold text-lg mb-2">Invoice Generation</h3>
          <p className="text-blue-100">Create professional invoices with automatic IVA and retention calculation</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-white">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-bold text-lg mb-2">Financial Dashboard</h3>
          <p className="text-blue-100">Track income and expenses with real-time analytics</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 text-white">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-bold text-lg mb-2">Client Management</h3>
          <p className="text-blue-100">Manage clients and products in one centralized location</p>
        </div>
      </div>
    </div>
  );
}
