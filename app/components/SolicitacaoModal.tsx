"use client";

import { useState } from "react";
import Modal from "./Modal";
import { Solicitacao, SituacaoUnidade, TipoBomba } from "@/lib/types";

type Aba = "principal" | "adicional";

export default function SolicitacaoModal({
  solicitacao,
  onClose,
  onSaved,
}: {
  solicitacao?: Solicitacao;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editando = !!solicitacao;

  const [aba, setAba] = useState<Aba>("principal");
  const [unidadeSolicitante, setUnidadeSolicitante] = useState(
    solicitacao?.unidadeSolicitante ?? ""
  );
  const [situacaoUnidade, setSituacaoUnidade] = useState<SituacaoUnidade>(
    solicitacao?.situacaoUnidade ?? "SEM_AGUA"
  );
  const [cvBomba, setCvBomba] = useState(solicitacao?.cvBomba?.toString() ?? "");
  const [tipoBomba, setTipoBomba] = useState<TipoBomba>(solicitacao?.tipoBomba ?? "CENTRIFUGA");
  const [numeroProcessoPAE, setNumeroProcessoPAE] = useState(
    solicitacao?.numeroProcessoPAE ?? ""
  );
  const [informacoesAdicionais, setInformacoesAdicionais] = useState(
    solicitacao?.informacoesAdicionais ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      unidadeSolicitante,
      situacaoUnidade,
      cvBomba,
      tipoBomba,
      numeroProcessoPAE,
      informacoesAdicionais,
    };

    const res = await fetch(
      editando ? `/api/solicitacoes/${solicitacao!.id}` : "/api/solicitacoes",
      {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);

    if (!res.ok) {
      setError("Erro ao salvar solicitação.");
      return;
    }

    onSaved();
    onClose();
  }

  const tabClasses = (ativa: boolean) =>
    `flex-1 rounded px-3 py-1.5 text-sm font-medium ${
      ativa
        ? "bg-blue-600 text-white"
        : "bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
    }`;

  return (
    <Modal title={editando ? "Editar Solicitação" : "Cadastrar Solicitação"} onClose={onClose}>
      <div className="mb-4 flex gap-1 rounded border p-1 dark:border-neutral-600">
        <button type="button" className={tabClasses(aba === "principal")} onClick={() => setAba("principal")}>
          Dados da Solicitação
        </button>
        <button type="button" className={tabClasses(aba === "adicional")} onClick={() => setAba("adicional")}>
          Informações Adicionais
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {aba === "principal" ? (
          <>
            <label className="flex flex-col gap-1 text-sm">
              Unidade solicitante
              <input
                required
                className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                value={unidadeSolicitante}
                onChange={(e) => setUnidadeSolicitante(e.target.value)}
                placeholder="Ex: UBS Centro"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Situação da unidade
              <select
                className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                value={situacaoUnidade}
                onChange={(e) => setSituacaoUnidade(e.target.value as SituacaoUnidade)}
              >
                <option value="SEM_AGUA">Completamente sem água</option>
                <option value="BOMBA_EMPRESTADA">Com bomba emprestada</option>
              </select>
            </label>

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
              Número do processo PAE (opcional)
              <input
                className="rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                value={numeroProcessoPAE}
                onChange={(e) => setNumeroProcessoPAE(e.target.value)}
                placeholder="Ex: 00000.000000/2026-00"
              />
            </label>
          </>
        ) : (
          <label className="flex flex-col gap-1 text-sm">
            Informações adicionais
            <textarea
              className="min-h-[140px] rounded border px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700"
              value={informacoesAdicionais}
              onChange={(e) => setInformacoesAdicionais(e.target.value)}
              placeholder="Observações, histórico, contato da unidade, etc."
            />
          </label>
        )}

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
