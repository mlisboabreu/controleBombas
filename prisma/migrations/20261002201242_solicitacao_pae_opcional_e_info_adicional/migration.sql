-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Solicitacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "unidadeSolicitante" TEXT NOT NULL,
    "situacaoUnidade" TEXT NOT NULL,
    "cvBomba" REAL NOT NULL,
    "tipoBomba" TEXT NOT NULL,
    "numeroProcessoPAE" TEXT,
    "informacoesAdicionais" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Solicitacao" ("createdAt", "cvBomba", "id", "numeroProcessoPAE", "situacaoUnidade", "tipoBomba", "unidadeSolicitante") SELECT "createdAt", "cvBomba", "id", "numeroProcessoPAE", "situacaoUnidade", "tipoBomba", "unidadeSolicitante" FROM "Solicitacao";
DROP TABLE "Solicitacao";
ALTER TABLE "new_Solicitacao" RENAME TO "Solicitacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
