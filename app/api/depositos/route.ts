import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const depositos = await prisma.deposito.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(depositos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cvBomba, tipoBomba, status } = body;

  if (!cvBomba || !tipoBomba || !status) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  const deposito = await prisma.deposito.create({
    data: {
      cvBomba: parseFloat(cvBomba),
      tipoBomba,
      status,
    },
  });

  return NextResponse.json(deposito, { status: 201 });
}
