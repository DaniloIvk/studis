/*
  Warnings:

  - Added the required column `exam_period_id` to the `exams` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" INTEGER NOT NULL,
    "exam_period_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "date" DATETIME NOT NULL,
    "created_by_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "exams_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exams_exam_period_id_fkey" FOREIGN KEY ("exam_period_id") REFERENCES "exam_periods" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exams_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_exams" ("course_id", "created_at", "created_by_id", "date", "description", "id", "title", "updated_at") SELECT "course_id", "created_at", "created_by_id", "date", "description", "id", "title", "updated_at" FROM "exams";
DROP TABLE "exams";
ALTER TABLE "new_exams" RENAME TO "exams";
CREATE INDEX "exams_course_id_fkey" ON "exams"("course_id");
CREATE INDEX "exams_exam_period_id_fkey" ON "exams"("exam_period_id");
CREATE INDEX "exams_created_by_id_fkey" ON "exams"("created_by_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
