/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Anecdote` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Anecdote" DROP CONSTRAINT "Anecdote_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userEmail_fkey";

-- AlterTable
ALTER TABLE "Anecdote" DROP COLUMN "userEmail";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userEmail",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Anecdote" ADD CONSTRAINT "Anecdote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
