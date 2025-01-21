-- DropForeignKey
ALTER TABLE "Saved" DROP CONSTRAINT "Saved_anecdoteId_fkey";

-- DropForeignKey
ALTER TABLE "Saved" DROP CONSTRAINT "Saved_userId_fkey";

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_anecdoteId_fkey" FOREIGN KEY ("anecdoteId") REFERENCES "Anecdote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
