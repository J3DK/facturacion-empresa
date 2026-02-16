export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productos = await prisma.producto.findMany({
      where: { userId: session.user.id },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nombre, descripcion, precioUnitario, sku, categoria, stock } = await req.json();

    if (!nombre || !precioUnitario) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const producto = await prisma.producto.create({
      data: {
        userId: session.user.id,
        nombre,
        descripcion,
        precioUnitario,
        sku,
        categoria,
        stock: stock || 0,
      },
    });

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
