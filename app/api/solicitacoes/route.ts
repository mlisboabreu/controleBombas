import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const solicitacoes = await prisma.solicitacao.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(solicitacoes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    unidadeSolicitante,
    situacaoUnidade,
    cvBomba,
    tipoBomba,
    numeroProcessoPAE,
    informacoesAdicionais,
  } = body;

  if (!unidadeSolicitante || !situacaoUnidade || !cvBomba || !tipoBomba) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  const solicitacao = await prisma.solicitacao.create({
    data: {
      unidadeSolicitante,
      situacaoUnidade,
      cvBomba: parseFloat(cvBomba),
      tipoBomba,
      numeroProcessoPAE: numeroProcessoPAE || null,
      informacoesAdicionais: informacoesAdicionais || null,
    },
  });

  return NextResponse.json(solicitacao, { status: 201 });
}
