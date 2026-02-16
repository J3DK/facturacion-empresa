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

    const facturas = await prisma.factura.findMany({
      where: { userId: session.user.id },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(facturas);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clienteId, items, fecha, notas } = await req.json();

    let subtotal = 0;
    let totalIva = 0;

    const config = await prisma.configuracion.findUnique({
      where: { userId: session.user.id },
    });

    const porcentajeIva = config?.porcentajeIva || 16;

    for (const item of items) {
      subtotal += item.cantidad * item.precioUnitario;
      totalIva += (item.cantidad * item.precioUnitario * porcentajeIva) / 100;
    }

    const totalFinal = subtotal + totalIva;

    const numeroFactura = `FAC-${Date.now()}`;

    const factura = await prisma.factura.create({
      data: {
        userId: session.user.id,
        numeroFactura,
        clienteId,
        fecha: new Date(fecha),
        subtotal,
        iva: totalIva,
        totalFinal,
        notas,
        items: {
          create: items.map((item: any) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            ivaAplicado: Math.round(porcentajeIva),
            subtotal: item.cantidad * item.precioUnitario,
          })),
        },
      },
      include: {
        cliente: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    return NextResponse.json(factura, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
