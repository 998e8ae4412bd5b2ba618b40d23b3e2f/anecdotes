/*
  Warnings:

  - You are about to drop the column `dislikes` on the `Anecdote` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Anecdote` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Anecdote` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Anecdote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anecdote" DROP COLUMN "dislikes",
DROP COLUMN "likes",
DROP COLUMN "views",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "anecdoteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dislike" (
    "id" TEXT NOT NULL,
    "anecdoteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_anecdoteId_fkey" FOREIGN KEY ("anecdoteId") REFERENCES "Anecdote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_anecdoteId_fkey" FOREIGN KEY ("anecdoteId") REFERENCES "Anecdote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
