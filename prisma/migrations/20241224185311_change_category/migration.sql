/*
  Warnings:

  - A unique constraint covering the columns `[userId,anecdoteId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_anecdoteId_key" ON "Like"("userId", "anecdoteId");
