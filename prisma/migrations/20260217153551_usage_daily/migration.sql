-- CreateTable
CREATE TABLE "UsageDaily" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "eventsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageDaily_orgId_day_idx" ON "UsageDaily"("orgId", "day");

-- CreateIndex
CREATE INDEX "UsageDaily_apiKeyId_day_idx" ON "UsageDaily"("apiKeyId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "UsageDaily_orgId_apiKeyId_day_key" ON "UsageDaily"("orgId", "apiKeyId", "day");

-- AddForeignKey
ALTER TABLE "UsageDaily" ADD CONSTRAINT "UsageDaily_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageDaily" ADD CONSTRAINT "UsageDaily_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
