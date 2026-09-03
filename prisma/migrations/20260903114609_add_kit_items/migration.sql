-- CreateTable
CREATE TABLE "KitItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KitTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "KitItemImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "KitItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "KitItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KitHeart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KitHeart_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "KitItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_KitItemTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_KitItemTags_A_fkey" FOREIGN KEY ("A") REFERENCES "KitItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_KitItemTags_B_fkey" FOREIGN KEY ("B") REFERENCES "KitTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "KitTag_name_key" ON "KitTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KitHeart_itemId_anonymousId_key" ON "KitHeart"("itemId", "anonymousId");

-- CreateIndex
CREATE UNIQUE INDEX "_KitItemTags_AB_unique" ON "_KitItemTags"("A", "B");

-- CreateIndex
CREATE INDEX "_KitItemTags_B_index" ON "_KitItemTags"("B");
