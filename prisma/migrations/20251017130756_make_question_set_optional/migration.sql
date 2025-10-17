-- DropForeignKey
ALTER TABLE "public"."questions" DROP CONSTRAINT "questions_questionSetId_fkey";

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "questionSetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "question_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
