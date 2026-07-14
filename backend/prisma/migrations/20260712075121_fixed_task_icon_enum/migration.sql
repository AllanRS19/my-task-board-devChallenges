/*
  Warnings:

  - Changed the type of `icon` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "icon",
ADD COLUMN     "icon" "TaskIcon" NOT NULL;
