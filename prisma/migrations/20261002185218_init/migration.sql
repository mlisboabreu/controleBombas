-- CreateTable
CREATE TABLE "Solicitacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unidadeSolicitante" TEXT NOT NULL,
    "situacaoUnidade" TEXT NOT NULL,
    "cvBomba" REAL NOT NULL,
    "tipoBomba" TEXT NOT NULL,
    "numeroProcessoPAE" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Manutencao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cvBomba" REAL NOT NULL,
    "tipoBomba" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Deposito" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cvBomba" REAL NOT NULL,
    "tipoBomba" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
