import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { cvBomba, tipoBomba, status } = body;
  const manutencao = await prisma.manutencao.update({
    where: { id: parseInt(id) },
    data: {
      cvBomba: cvBomba !== undefined ? parseFloat(cvBomba) : undefined,
      tipoBomba,
      status,
    },
  });
  return NextResponse.json(manutencao);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.manutencao.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
