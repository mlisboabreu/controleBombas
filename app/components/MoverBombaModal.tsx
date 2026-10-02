"use client";

import { useMemo, useState } from "react";
import Modal from "./Modal";
import {
  Deposito,
  Manutencao,
  Solicitacao,
  TIPO_BOMBA_LABEL,
} from "@/lib/types";

type Categoria = "solicitacao" | "manutencao" | "deposito";
type Destino = "manutencao" | "deposito";

const CATEGORIA_LABEL: Record<Categoria, string> = {
  solicitacao: "Solicitação",
  manutencao: "Manutenção",
  deposito: "Depósito",
};

export default function MoverBombaModal({
  destino,
  solicitacoes,
  manutencoes,
  depositos,
  onClose,
  onSaved,
}: {
  destino: Destino;
  solicitacoes: Solicitacao[];
  manutencoes: Manutencao[];
  depositos: Deposito[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const categoriasDisponiveis = (["solicitacao", "manutencao", "deposito"] as Categoria[]).filter(
    (c) => c !== destino
  );

  const [fromType, setFromType] = useState<Categoria>(categoriasDisponiveis[0]);
  const [fromId, setFromId] = useState<string>("");
  const [status, setStatus] = useState(destino === "manutencao" ? "EM_MANUTENCAO" : "LIVRE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const titulo =
    destino === "manutencao" ? "Adicionar de Outra Categoria (Manutenção)" : "Adicionar de Outra Categoria (Depósito)";

  const registros = useMemo(() => {
    if (fromType === "solicitacao") {
      return solicitacoes.map((s) => ({
        id: s.id,
        label: `${s.unidadeSolicitante} — CV ${s.cvBomba} ${TIPO_BOMBA_LABEL[s.tipoBomba]}`,
      }));
    }
    if (fromType === "manutencao") {
      return manutencoes.map((m) => ({
        id: m.id,
        label: `CV ${m.cvBomba} ${TIPO_BOMBA_LABEL[m.tipoBomba]}`,
      }));
    }
    return depositos.map((d) => ({
      id: d.id,
      label: `CV ${d.cvBomba} ${TIPO_BOMBA_LABEL[d.tipoBomba]}`,
    }));
  }, [fromType, solicitacoes, manutencoes, depositos]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fromId) {
      setError("Selecione um registro de origem.");
      return;
    }

    setSaving(true);
    setError("");

    const res = await fetch("/api/mover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromType,
        fromId: parseInt(fromId),
        toType: destino,
        status,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Erro ao mover bomba.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal title={titulo} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Categoria de origem
          <select
            className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
            value={fromType}
            onChange={(e) => {
              setFromType(e.target.value as Categoria);
              setFromId("");
            }}
          >
            {categoriasDisponiveis.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_LABEL[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Bomba
          <select
            required
            className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
          >
            <option value="" disabled>
              Selecione...
            </option>
            {registros.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          {registros.length === 0 && (
            <span className="text-xs text-neutral-500">Nenhum registro disponível nessa categoria.</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Status em {CATEGORIA_LABEL[destino]}
          <select
            className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {destino === "manutencao" ? (
              <>
                <option value="EM_MANUTENCAO">Em manutenção</option>
                <option value="LIVRE_RETIRADA">Livre para retirada</option>
              </>
            ) : (
              <>
                <option value="LIVRE">Livre</option>
                <option value="QUEBRADA">Quebrada</option>
              </>
            )}
          </select>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving || registros.length === 0}
          className="mt-2 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Movendo..." : "Mover"}
        </button>
      </form>
    </Modal>
  );
}
