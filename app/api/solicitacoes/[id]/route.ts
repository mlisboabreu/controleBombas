import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    unidadeSolicitante,
    situacaoUnidade,
    cvBomba,
    tipoBomba,
    numeroProcessoPAE,
    informacoesAdicionais,
  } = body;

  const solicitacao = await prisma.solicitacao.update({
    where: { id: parseInt(id) },
    data: {
      unidadeSolicitante,
      situacaoUnidade,
      cvBomba: cvBomba !== undefined ? parseFloat(cvBomba) : undefined,
      tipoBomba,
      numeroProcessoPAE: numeroProcessoPAE || null,
      informacoesAdicionais: informacoesAdicionais || null,
    },
  });

  return NextResponse.json(solicitacao);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.solicitacao.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
