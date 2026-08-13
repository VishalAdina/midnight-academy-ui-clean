-- CreateTable
CREATE TABLE "OAuthExchangeCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthExchangeCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthExchangeCode_codeHash_key" ON "OAuthExchangeCode"("codeHash");

-- CreateIndex
CREATE INDEX "OAuthExchangeCode_userId_idx" ON "OAuthExchangeCode"("userId");

-- AddForeignKey
ALTER TABLE "OAuthExchangeCode" ADD CONSTRAINT "OAuthExchangeCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
