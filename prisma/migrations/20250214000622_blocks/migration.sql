-- CreateTable
CREATE TABLE "BlockGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "options" TEXT
);

-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "blockType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    CONSTRAINT "Block_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BlockGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_block_group_created" ON "BlockGroup"("createdAt");

-- CreateIndex
CREATE INDEX "idx_block_group_updated" ON "BlockGroup"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_block_group_status" ON "BlockGroup"("status");

-- CreateIndex
CREATE UNIQUE INDEX "unq_block_group_name" ON "BlockGroup"("name");

-- CreateIndex
CREATE INDEX "idx_block_type" ON "Block"("blockType");

-- CreateIndex
CREATE INDEX "idx_block_name" ON "Block"("name");

-- CreateIndex
CREATE INDEX "idx_block_group" ON "Block"("groupId");

-- CreateIndex
CREATE INDEX "idx_block_created" ON "Block"("createdAt");

-- CreateIndex
CREATE INDEX "idx_block_updated" ON "Block"("updatedAt");

-- CreateIndex
CREATE INDEX "idx_block_status" ON "Block"("status");

-- CreateIndex
CREATE UNIQUE INDEX "unq_block_name" ON "Block"("groupId", "name");

INSERT INTO "Privilege" ("subject","action") VALUES
	('Block','read'),
    ('Block','create'),
	('Block','update'),
	('Block','delete'),
    ('BlockGroup','read'),
    ('BlockGroup','create'),
	('BlockGroup','update'),
	('BlockGroup','delete');
