import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const manutencoes = await prisma.manutencao.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(manutencoes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cvBomba, tipoBomba, status } = body;

  if (!cvBomba || !tipoBomba || !status) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  const manutencao = await prisma.manutencao.create({
    data: {
      cvBomba: parseFloat(cvBomba),
      tipoBomba,
      status,
    },
  });

  return NextResponse.json(manutencao, { status: 201 });
}
