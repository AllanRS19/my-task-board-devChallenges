/*
  Warnings:

  - Changed the type of `icon` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskIcon" AS ENUM ('DEV', 'CHAT', 'COFFEE', 'GYM', 'BOOKS', 'CLOCK');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "icon",
ADD COLUMN     "icon" "TaskStatus" NOT NULL;
