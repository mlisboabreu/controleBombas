export type TipoBomba = "CENTRIFUGA" | "SUBMERSA";
export type SituacaoUnidade = "SEM_AGUA" | "BOMBA_EMPRESTADA";
export type StatusManutencao = "LIVRE_RETIRADA" | "EM_MANUTENCAO";
export type StatusDeposito = "QUEBRADA" | "LIVRE";

export interface Solicitacao {
  id: number;
  unidadeSolicitante: string;
  situacaoUnidade: SituacaoUnidade;
  cvBomba: number;
  tipoBomba: TipoBomba;
  numeroProcessoPAE: string | null;
  informacoesAdicionais: string | null;
  createdAt: string;
}

export interface Manutencao {
  id: number;
  cvBomba: number;
  tipoBomba: TipoBomba;
  status: StatusManutencao;
  createdAt: string;
}

export interface Deposito {
  id: number;
  cvBomba: number;
  tipoBomba: TipoBomba;
  status: StatusDeposito;
  createdAt: string;
}

export const TIPO_BOMBA_LABEL: Record<TipoBomba, string> = {
  CENTRIFUGA: "Centrífuga",
  SUBMERSA: "Submersa",
};

export const SITUACAO_UNIDADE_LABEL: Record<SituacaoUnidade, string> = {
  SEM_AGUA: "Completamente sem água",
  BOMBA_EMPRESTADA: "Com bomba emprestada",
};

export const STATUS_MANUTENCAO_LABEL: Record<StatusManutencao, string> = {
  LIVRE_RETIRADA: "Livre para retirada",
  EM_MANUTENCAO: "Em manutenção",
};

export const STATUS_DEPOSITO_LABEL: Record<StatusDeposito, string> = {
  QUEBRADA: "Quebrada",
  LIVRE: "Livre",
};
