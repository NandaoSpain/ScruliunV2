/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `TaskPriority` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,COMPLETED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN,USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskPriority_new" AS ENUM ('low', 'medium', 'high');
ALTER TABLE "task" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "priority" TYPE "TaskPriority_new" USING ("priority"::text::"TaskPriority_new");
ALTER TYPE "TaskPriority" RENAME TO "TaskPriority_old";
ALTER TYPE "TaskPriority_new" RENAME TO "TaskPriority";
DROP TYPE "TaskPriority_old";
ALTER TABLE "task" ALTER COLUMN "priority" SET DEFAULT 'low';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('pending', 'inProgress', 'completed');
ALTER TABLE "task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TABLE "task_history" ALTER COLUMN "old_status" TYPE "TaskStatus_new" USING ("old_status"::text::"TaskStatus_new");
ALTER TABLE "task_history" ALTER COLUMN "new_status" TYPE "TaskStatus_new" USING ("new_status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "task" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('admin', 'user');
ALTER TABLE "user" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "priority" SET DEFAULT 'low';
