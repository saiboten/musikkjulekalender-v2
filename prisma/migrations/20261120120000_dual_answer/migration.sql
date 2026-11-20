-- DropIndex
DROP INDEX "Answer_dayId_userId_key";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "part" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Day" ADD COLUMN     "artist2" TEXT,
ADD COLUMN     "dualAnswer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "song2" TEXT;

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "part" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Answer_dayId_userId_part_key" ON "Answer"("dayId", "userId", "part");
