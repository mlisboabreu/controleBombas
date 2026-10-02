"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Deposito,
  Manutencao,
  Solicitacao,
  STATUS_DEPOSITO_LABEL,
  STATUS_MANUTENCAO_LABEL,
  SITUACAO_UNIDADE_LABEL,
  TIPO_BOMBA_LABEL,
  StatusDeposito,
  StatusManutencao,
} from "@/lib/types";
import SolicitacaoModal from "./SolicitacaoModal";
import NovaBombaModal from "./NovaBombaModal";
import MoverBombaModal from "./MoverBombaModal";

type AddMenuAberto = "manutencao" | "deposito" | null;
type ModalAberto =
  | { tipo: "solicitacao"; solicitacao?: Solicitacao }
  | { tipo: "novaBomba"; categoria: "manutencao" | "deposito"; bomba?: Manutencao | Deposito }
  | { tipo: "mover"; destino: "manutencao" | "deposito" }
  | null;

export default function Dashboard() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalAberto>(null);
  const [addMenuAberto, setAddMenuAberto] = useState<AddMenuAberto>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    const [sRes, mRes, dRes] = await Promise.all([
      fetch("/api/solicitacoes"),
      fetch("/api/manutencoes"),
      fetch("/api/depositos"),
    ]);
    setSolicitacoes(await sRes.json());
    setManutencoes(await mRes.json());
    setDepositos(await dRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAddMenuAberto(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function excluirSolicitacao(id: number) {
    await fetch(`/api/solicitacoes/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function excluirManutencao(id: number) {
    await fetch(`/api/manutencoes/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function excluirDeposito(id: number) {
    await fetch(`/api/depositos/${id}`, { method: "DELETE" });
    fetchAll();
  }

  async function atualizarStatusManutencao(id: number, status: StatusManutencao) {
    await fetch(`/api/manutencoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
  }

  async function atualizarStatusDeposito(id: number, status: StatusDeposito) {
    await fetch(`/api/depositos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAll();
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Controle de Bombas</h1>
        <button
          onClick={() => setModal({ tipo: "solicitacao" })}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Cadastrar Solicitação
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Coluna Solicitação */}
          <div className="rounded-lg border p-4 dark:border-neutral-600">
            <h2 className="mb-3 font-semibold">Solicitação ({solicitacoes.length})</h2>
            <div className="flex flex-col gap-2">
              {solicitacoes.length === 0 && (
                <p className="text-sm text-neutral-500">Nenhuma solicitação.</p>
              )}
              {solicitacoes.map((s) => (
                <div
                  key={s.id}
                  className="rounded border p-3 text-sm dark:border-neutral-600"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{s.unidadeSolicitante}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ tipo: "solicitacao", solicitacao: s })}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        editar
                      </button>
                      <button
                        onClick={() => excluirSolicitacao(s.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        excluir
                      </button>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {SITUACAO_UNIDADE_LABEL[s.situacaoUnidade]}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    CV {s.cvBomba} · {TIPO_BOMBA_LABEL[s.tipoBomba]}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    PAE: {s.numeroProcessoPAE || "—"}
                  </p>
                  {s.informacoesAdicionais && (
                    <p className="mt-1 text-neutral-500 italic dark:text-neutral-500">
                      {s.informacoesAdicionais}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Manutenção */}
          <div className="rounded-lg border p-4 dark:border-neutral-600">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Manutenção ({manutencoes.length})</h2>
              <div className="relative" ref={addMenuAberto === "manutencao" ? menuRef : null}>
                <button
                  onClick={() =>
                    setAddMenuAberto(addMenuAberto === "manutencao" ? null : "manutencao")
                  }
                  className="rounded border px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700"
                >
                  + Adicionar
                </button>
                {addMenuAberto === "manutencao" && (
                  <div className="absolute right-0 z-10 mt-1 w-48 rounded border bg-white shadow-lg dark:border-neutral-600 dark:bg-neutral-800">
                    <button
                      onClick={() => {
                        setModal({ tipo: "novaBomba", categoria: "manutencao" });
                        setAddMenuAberto(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      Adicionar nova bomba
                    </button>
                    <button
                      onClick={() => {
                        setModal({ tipo: "mover", destino: "manutencao" });
                        setAddMenuAberto(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      Adicionar de outra categoria
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {manutencoes.length === 0 && (
                <p className="text-sm text-neutral-500">Nenhuma bomba em manutenção.</p>
              )}
              {manutencoes.map((m) => (
                <div
                  key={m.id}
                  className="rounded border p-3 text-sm dark:border-neutral-600"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">
                      CV {m.cvBomba} · {TIPO_BOMBA_LABEL[m.tipoBomba]}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ tipo: "novaBomba", categoria: "manutencao", bomba: m })}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        editar
                      </button>
                      <button
                        onClick={() => excluirManutencao(m.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        excluir
                      </button>
                    </div>
                  </div>
                  <select
                    value={m.status}
                    onChange={(e) =>
                      atualizarStatusManutencao(m.id, e.target.value as StatusManutencao)
                    }
                    className="mt-2 w-full rounded border px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-700"
                  >
                    <option value="EM_MANUTENCAO">
                      {STATUS_MANUTENCAO_LABEL.EM_MANUTENCAO}
                    </option>
                    <option value="LIVRE_RETIRADA">
                      {STATUS_MANUTENCAO_LABEL.LIVRE_RETIRADA}
                    </option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Depósito */}
          <div className="rounded-lg border p-4 dark:border-neutral-600">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Depósito ({depositos.length})</h2>
              <div className="relative" ref={addMenuAberto === "deposito" ? menuRef : null}>
                <button
                  onClick={() =>
                    setAddMenuAberto(addMenuAberto === "deposito" ? null : "deposito")
                  }
                  className="rounded border px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700"
                >
                  + Adicionar
                </button>
                {addMenuAberto === "deposito" && (
                  <div className="absolute right-0 z-10 mt-1 w-48 rounded border bg-white shadow-lg dark:border-neutral-600 dark:bg-neutral-800">
                    <button
                      onClick={() => {
                        setModal({ tipo: "novaBomba", categoria: "deposito" });
                        setAddMenuAberto(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      Adicionar nova bomba
                    </button>
                    <button
                      onClick={() => {
                        setModal({ tipo: "mover", destino: "deposito" });
                        setAddMenuAberto(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      Adicionar de outra categoria
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {depositos.length === 0 && (
                <p className="text-sm text-neutral-500">Nenhuma bomba no depósito.</p>
              )}
              {depositos.map((d) => (
                <div
                  key={d.id}
                  className="rounded border p-3 text-sm dark:border-neutral-600"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">
                      CV {d.cvBomba} · {TIPO_BOMBA_LABEL[d.tipoBomba]}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ tipo: "novaBomba", categoria: "deposito", bomba: d })}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        editar
                      </button>
                      <button
                        onClick={() => excluirDeposito(d.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        excluir
                      </button>
                    </div>
                  </div>
                  <select
                    value={d.status}
                    onChange={(e) =>
                      atualizarStatusDeposito(d.id, e.target.value as StatusDeposito)
                    }
                    className="mt-2 w-full rounded border px-2 py-1 text-sm dark:border-neutral-600 dark:bg-neutral-700"
                  >
                    <option value="LIVRE">{STATUS_DEPOSITO_LABEL.LIVRE}</option>
                    <option value="QUEBRADA">{STATUS_DEPOSITO_LABEL.QUEBRADA}</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal?.tipo === "solicitacao" && (
        <SolicitacaoModal
          solicitacao={modal.solicitacao}
          onClose={() => setModal(null)}
          onSaved={fetchAll}
        />
      )}

      {modal?.tipo === "novaBomba" && (
        <NovaBombaModal
          categoria={modal.categoria}
          bomba={modal.bomba}
          onClose={() => setModal(null)}
          onSaved={fetchAll}
        />
      )}

      {modal?.tipo === "mover" && (
        <MoverBombaModal
          destino={modal.destino}
          solicitacoes={solicitacoes}
          manutencoes={manutencoes}
          depositos={depositos}
          onClose={() => setModal(null)}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
}
