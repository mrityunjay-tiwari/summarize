-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "full_name" VARCHAR(255),
    "customer_id" VARCHAR(255),
    "price_id" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'inactive',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PdfSummary" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "original_file_url" TEXT NOT NULL,
    "summary_text" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'completed',
    "title" TEXT,
    "file_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdfSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "stripe_payment_id" VARCHAR(255) NOT NULL,
    "price_id" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_customer_id_key" ON "public"."User"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_stripe_payment_id_key" ON "public"."Payments"("stripe_payment_id");

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
