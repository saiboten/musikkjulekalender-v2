-- DropIndex
DROP INDEX "Answer_dayId_userId_part_key";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'song';

-- AlterTable
ALTER TABLE "Guess" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'song';

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'song';

-- CreateIndex
CREATE UNIQUE INDEX "Answer_dayId_userId_part_kind_key" ON "Answer"("dayId", "userId", "part", "kind");
