/*
  Warnings:

  - You are about to drop the column `catSlug` on the `Anecdote` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Anecdote` table. All the data in the column will be lost.
  - You are about to drop the column `postSlug` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postSlug_fkey";

-- DropIndex
DROP INDEX "Anecdote_slug_key";

-- AlterTable
ALTER TABLE "Anecdote" DROP COLUMN "catSlug",
DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postSlug",
ADD COLUMN     "postId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Anecdote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
