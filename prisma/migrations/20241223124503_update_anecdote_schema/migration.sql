/*
  Warnings:

  - The `views` column on the `Anecdote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `likes` column on the `Anecdote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Anecdote" ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "views",
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "likes",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
