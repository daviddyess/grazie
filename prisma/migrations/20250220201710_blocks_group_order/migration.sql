/*
  Warnings:

  - You are about to drop the column `weight` on the `BlockGroupBlock` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlockGroupBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "groupId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    "order" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlockGroupBlock_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BlockGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlockGroupBlock_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlockGroupBlock" ("blockId", "createdAt", "groupId", "id", "order", "status", "updatedAt") SELECT "blockId", "createdAt", "groupId", "id", "order", "status", "updatedAt" FROM "BlockGroupBlock";
DROP TABLE "BlockGroupBlock";
ALTER TABLE "new_BlockGroupBlock" RENAME TO "BlockGroupBlock";
CREATE INDEX "idx_block_group_block_group" ON "BlockGroupBlock"("groupId");
CREATE INDEX "idx_block_group_block_block" ON "BlockGroupBlock"("blockId");
CREATE INDEX "idx_block_group_block_status" ON "BlockGroupBlock"("status");
CREATE INDEX "idx_block_group_block_group_status" ON "BlockGroupBlock"("groupId", "status");
CREATE INDEX "idx_block_group_block_order" ON "BlockGroupBlock"("order");
CREATE UNIQUE INDEX "unq_block_group_block" ON "BlockGroupBlock"("groupId", "blockId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
