-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER,
    "postsCount" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "path" TEXT,
    "description" TEXT,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("description", "id", "name", "parentId", "path", "postsCount", "slug") SELECT "description", "id", "name", "parentId", "path", "postsCount", "slug" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "idx_category_parent" ON "Category"("parentId");
CREATE INDEX "idx_category_posts" ON "Category"("postsCount");
CREATE INDEX "idx_category_description" ON "Category"("description");
CREATE UNIQUE INDEX "unq_category_name" ON "Category"("name");
CREATE UNIQUE INDEX "unq_category_slug" ON "Category"("slug");
CREATE UNIQUE INDEX "unq_category_path" ON "Category"("path");
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TEXT NOT NULL,
    "publishedAt" TEXT,
    "updatedAt" TEXT NOT NULL,
    "path" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "search" TEXT,
    "meta" TEXT,
    CONSTRAINT "Page_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Page_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("authorId", "body", "createdAt", "id", "meta", "published", "publishedAt", "search", "slug", "summary", "title", "updatedAt", "viewsCount") SELECT "authorId", "body", "createdAt", "id", "meta", "published", "publishedAt", "search", "slug", "summary", "title", "updatedAt", "viewsCount" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE INDEX "idx_page_author" ON "Page"("authorId");
CREATE INDEX "idx_page_created" ON "Page"("createdAt");
CREATE INDEX "idx_page_published" ON "Page"("published");
CREATE INDEX "idx_page_publishedAt" ON "Page"("publishedAt");
CREATE INDEX "idx_page_updated" ON "Page"("updatedAt");
CREATE INDEX "idx_page_parent" ON "Page"("parentId");
CREATE INDEX "idx_page_search" ON "Page"("search");
CREATE INDEX "idx_page_summary" ON "Page"("summary");
CREATE INDEX "idx_page_views_count" ON "Page"("viewsCount");
CREATE UNIQUE INDEX "unq_page_slug" ON "Page"("slug");
CREATE UNIQUE INDEX "idx_page_path" ON "Page"("path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
