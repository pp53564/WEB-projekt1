-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "competitorsId" INTEGER;

-- CreateTable
CREATE TABLE "Competitors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,

    CONSTRAINT "Competitors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Competitors" ADD CONSTRAINT "Competitors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitors" ADD CONSTRAINT "Competitors_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitorsId_fkey" FOREIGN KEY ("competitorsId") REFERENCES "Competitors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
