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

    const clientes = await prisma.cliente.findMany({
      where: { userId: session.user.id },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nombre, email, telefono, direccion, ciudad, codigoPostal, pais, rfc, razonSocial } = await req.json();

    if (!nombre) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        userId: session.user.id,
        nombre,
        email,
        telefono,
        direccion,
        ciudad,
        codigoPostal,
        pais,
        rfc,
        razonSocial,
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
