export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6 hidden md:block">
        <div>
          <h1 className="text-2xl font-bold">Factura Pro</h1>
          <p className="text-gray-400 text-sm">v1.0</p>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            📊 Dashboard
          </Link>
          <Link href="/dashboard/invoices" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            📄 Invoices
          </Link>
          <Link href="/dashboard/expenses" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            💰 Expenses
          </Link>
          <Link href="/dashboard/clients" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            👥 Clients
          </Link>
          <Link href="/dashboard/products" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            📦 Products
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            ⚙️ Settings
          </Link>
        </nav>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-xs text-gray-400 mb-4">{session.user?.email}</p>
          <form action={async () => {
            "use server"
            await signOut({ redirect: true, callbackUrl: "/" });
          }}>
            <button type="submit" className="w-full px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
