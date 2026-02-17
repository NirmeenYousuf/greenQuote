-- Create ENUM type for userType
CREATE TYPE user_type_enum AS ENUM ('admin', 'user');

-- Create Users table
CREATE TABLE "Users" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "userType" user_type_enum NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL
);

-- Create Quotes table
CREATE TABLE "Quotes" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "monthlyConsumptionKwh" NUMERIC NOT NULL,
    "systemSizeKw" NUMERIC NOT NULL,
    "downPayment" NUMERIC NULL,
    "systemPrice" NUMERIC NOT NULL,
    "principalAmount" NUMERIC NOT NULL,
    "riskBand" VARCHAR(50) NOT NULL,
    "monthlyPaymentAmount5Years" NUMERIC NOT NULL,
    "monthlyPaymentAmount10Years" NUMERIC NOT NULL,
    "monthlyPaymentAmount15Years" NUMERIC NOT NULL,
	"createdAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY ("userId")
        REFERENCES "Users"(id)
        ON DELETE CASCADE
);

-- Insert admin user (ID auto-generated)
INSERT INTO "Users" ("name", "email", "password", "userType", "createdAt")
VALUES ('admin', 'admin@test.com', 'admin', 'admin', NOW());