import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Origem = "solicitacao" | "manutencao" | "deposito";
type Destino = "manutencao" | "deposito";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fromType, fromId, toType, status } = body as {
    fromType: Origem;
    fromId: number;
    toType: Destino;
    status: string;
  };

  if (!fromType || !fromId || !toType || !status) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  let cvBomba: number;
  let tipoBomba: string;

  if (fromType === "solicitacao") {
    const origem = await prisma.solicitacao.findUnique({ where: { id: fromId } });
    if (!origem) return NextResponse.json({ error: "Registro de origem não encontrado." }, { status: 404 });
    cvBomba = origem.cvBomba;
    tipoBomba = origem.tipoBomba;
  } else if (fromType === "manutencao") {
    const origem = await prisma.manutencao.findUnique({ where: { id: fromId } });
    if (!origem) return NextResponse.json({ error: "Registro de origem não encontrado." }, { status: 404 });
    cvBomba = origem.cvBomba;
    tipoBomba = origem.tipoBomba;
  } else if (fromType === "deposito") {
    const origem = await prisma.deposito.findUnique({ where: { id: fromId } });
    if (!origem) return NextResponse.json({ error: "Registro de origem não encontrado." }, { status: 404 });
    cvBomba = origem.cvBomba;
    tipoBomba = origem.tipoBomba;
  } else {
    return NextResponse.json({ error: "Categoria de origem inválida." }, { status: 400 });
  }

  if (toType === "manutencao") {
    await prisma.manutencao.create({
      data: { cvBomba, tipoBomba: tipoBomba as never, status: status as never },
    });
  } else if (toType === "deposito") {
    await prisma.deposito.create({
      data: { cvBomba, tipoBomba: tipoBomba as never, status: status as never },
    });
  } else {
    return NextResponse.json({ error: "Categoria de destino inválida." }, { status: 400 });
  }

  if (fromType === "solicitacao") {
    await prisma.solicitacao.delete({ where: { id: fromId } });
  } else if (fromType === "manutencao") {
    await prisma.manutencao.delete({ where: { id: fromId } });
  } else if (fromType === "deposito") {
    await prisma.deposito.delete({ where: { id: fromId } });
  }

  return NextResponse.json({ ok: true });
}
