-- CreateTable
CREATE TABLE "announcements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "codes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "courses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "professor_id" INTEGER,
    "semester" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "espb" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "courses_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "course_material_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exam_applications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exam_period_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "grade" REAL,
    "graded_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "exam_applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exam_applications_exam_period_id_fkey" FOREIGN KEY ("exam_period_id") REFERENCES "exam_periods" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exam_applications_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exam_periods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date_from" DATETIME NOT NULL,
    "date_to" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "personal_access_tokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "last_used_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "personal_access_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "index" TEXT,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "parent_name" TEXT,
    "address" TEXT,
    "phone_number" TEXT,
    "password" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "announcements_author_id_fkey" ON "announcements"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "codes_user_id_key" ON "codes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "courses_index_key" ON "courses"("index");

-- CreateIndex
CREATE INDEX "courses_professor_id_fkey" ON "courses"("professor_id");

-- CreateIndex
CREATE INDEX "course_material_course_id_fkey" ON "course_material"("course_id");

-- CreateIndex
CREATE INDEX "enrollments_course_id_fkey" ON "enrollments"("course_id");

-- CreateIndex
CREATE INDEX "enrollments_student_id_fkey" ON "enrollments"("student_id");

-- CreateIndex
CREATE INDEX "exam_applications_course_id_fkey" ON "exam_applications"("course_id");

-- CreateIndex
CREATE INDEX "exam_applications_exam_period_id_fkey" ON "exam_applications"("exam_period_id");

-- CreateIndex
CREATE INDEX "exam_applications_student_id_fkey" ON "exam_applications"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_access_tokens_token_key" ON "personal_access_tokens"("token");

-- CreateIndex
CREATE INDEX "personal_access_tokens_user_id_fkey" ON "personal_access_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_index_key" ON "users"("index");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
