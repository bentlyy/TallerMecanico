-- AlterTable: add login_attempts and locked_until to usuarios
ALTER TABLE "public"."usuarios" 
ADD COLUMN "login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "locked_until" TIMESTAMP(3);
