-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestSubmission" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "anecdoteId" TEXT NOT NULL,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContestSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContestSubmission_contestId_anecdoteId_key" ON "ContestSubmission"("contestId", "anecdoteId");

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_anecdoteId_fkey" FOREIGN KEY ("anecdoteId") REFERENCES "Anecdote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
