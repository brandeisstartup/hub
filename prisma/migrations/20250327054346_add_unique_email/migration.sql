-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "creator_email" VARCHAR(255) NOT NULL,
    "short_description" TEXT,
    "long_description" TEXT,
    "competition" VARCHAR(255),
    "team_members_emails" TEXT[],
    "video_url" VARCHAR(255),
    "image_url" VARCHAR(255),

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "secondaryEmail" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "graduationYear" INTEGER,
    "major" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_secondaryEmail_key" ON "Users"("secondaryEmail");
