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

    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const whereClause: any = { userId: session.user.id };

    if (startDate && endDate) {
      whereClause.fecha = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const gastos = await prisma.gasto.findMany({
      where: whereClause,
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(gastos);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { descripcion, cantidad, categoria, fecha, documento, notas } = await req.json();

    if (!descripcion || !cantidad || !categoria) {
      return NextResponse.json(
        { error: "Description, amount, and category are required" },
        { status: 400 }
      );
    }

    const gasto = await prisma.gasto.create({
      data: {
        userId: session.user.id,
        descripcion,
        cantidad,
        categoria,
        fecha: new Date(fecha || new Date()),
        documento,
        notas,
      },
    });

    return NextResponse.json(gasto, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
