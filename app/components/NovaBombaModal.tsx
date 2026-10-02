"use client";

import { useState } from "react";
import Modal from "./Modal";
import { TipoBomba } from "@/lib/types";

type Categoria = "manutencao" | "deposito";

interface BombaExistente {
  id: number;
  cvBomba: number;
  tipoBomba: TipoBomba;
  status: string;
}

export default function NovaBombaModal({
  categoria,
  bomba,
  onClose,
  onSaved,
}: {
  categoria: Categoria;
  bomba?: BombaExistente;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editando = !!bomba;

  const [cvBomba, setCvBomba] = useState(bomba?.cvBomba?.toString() ?? "");
  const [tipoBomba, setTipoBomba] = useState<TipoBomba>(bomba?.tipoBomba ?? "CENTRIFUGA");
  const [status, setStatus] = useState(
    bomba?.status ?? (categoria === "manutencao" ? "EM_MANUTENCAO" : "LIVRE")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tituloBase = categoria === "manutencao" ? "Bomba em Manutenção" : "Bomba no Depósito";
  const titulo = editando ? `Editar ${tituloBase}` : `Nova ${tituloBase}`;
  const endpointBase = categoria === "manutencao" ? "/api/manutencoes" : "/api/depositos";
  const endpoint = editando ? `${endpointBase}/${bomba!.id}` : endpointBase;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(endpoint, {
      method: editando ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvBomba, tipoBomba, status }),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Erro ao salvar bomba.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal title={titulo} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            CV da bomba
            <input
              required
              type="number"
              step="0.1"
              min="0"
              className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
              value={cvBomba}
              onChange={(e) => setCvBomba(e.target.value)}
              placeholder="Ex: 2"
            />
          </label>

          <label className="flex flex-1 flex-col gap-1 text-sm">
            Tipo da bomba
            <select
              className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
              value={tipoBomba}
              onChange={(e) => setTipoBomba(e.target.value as TipoBomba)}
            >
              <option value="CENTRIFUGA">Centrífuga</option>
              <option value="SUBMERSA">Submersa</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Status
          <select
            className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {categoria === "manutencao" ? (
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
          disabled={saving}
          className="mt-2 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </Modal>
  );
}
