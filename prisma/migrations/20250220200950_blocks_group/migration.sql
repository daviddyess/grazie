/*
  Warnings:

  - You are about to drop the column `groupId` on the `Block` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BlockGroupBlock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "groupId" INTEGER NOT NULL,
    "blockId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlockGroupBlock_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BlockGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlockGroupBlock_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "blockType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT
);
INSERT INTO "new_Block" ("blockType", "content", "createdAt", "description", "id", "name", "status", "title", "updatedAt") SELECT "blockType", "content", "createdAt", "description", "id", "name", "status", "title", "updatedAt" FROM "Block";
DROP TABLE "Block";
ALTER TABLE "new_Block" RENAME TO "Block";
CREATE INDEX "idx_block_type" ON "Block"("blockType");
CREATE INDEX "idx_block_name" ON "Block"("name");
CREATE INDEX "idx_block_created" ON "Block"("createdAt");
CREATE INDEX "idx_block_updated" ON "Block"("updatedAt");
CREATE INDEX "idx_block_status" ON "Block"("status");
CREATE UNIQUE INDEX "unq_block_name" ON "Block"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "idx_block_group_block_group" ON "BlockGroupBlock"("groupId");

-- CreateIndex
CREATE INDEX "idx_block_group_block_block" ON "BlockGroupBlock"("blockId");

-- CreateIndex
CREATE INDEX "idx_block_group_block_status" ON "BlockGroupBlock"("status");

-- CreateIndex
CREATE INDEX "idx_block_group_block_group_status" ON "BlockGroupBlock"("groupId", "status");

-- CreateIndex
CREATE INDEX "idx_block_group_block_order" ON "BlockGroupBlock"("order");

-- CreateIndex
CREATE INDEX "idx_block_group_block_weight" ON "BlockGroupBlock"("weight");

-- CreateIndex
CREATE UNIQUE INDEX "unq_block_group_block" ON "BlockGroupBlock"("groupId", "blockId");
