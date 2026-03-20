-- CreateEnum
CREATE TYPE "jobs_status" AS ENUM ('APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'GHOSTED');

-- CreateEnum
CREATE TYPE "jobs_priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "avatar_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "status" "jobs_status" DEFAULT 'APPLIED',
    "priority" "jobs_priority" DEFAULT 'MEDIUM',
    "source" VARCHAR(100),
    "applied_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "interview_date" TIMESTAMP(3),
    "notes" TEXT,
    "salary" VARCHAR(100),
    "location" VARCHAR(255),
    "job_url" VARCHAR(500),
    "contact_name" VARCHAR(100),
    "contact_email" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_id" ON "jobs"("user_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
