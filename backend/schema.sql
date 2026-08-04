-- =========================================================
-- DATABASE INITIALIZATION SCRIPT FOR CRM MEMBER LOYALTY
-- Database Target: loyalty
-- =========================================================

-- 1. Create Schemas
CREATE SCHEMA IF NOT EXISTS member;
CREATE SCHEMA IF NOT EXISTS admpanel;
CREATE SCHEMA IF NOT EXISTS points;
CREATE SCHEMA IF NOT EXISTS voucher;
CREATE SCHEMA IF NOT EXISTS promo;
CREATE SCHEMA IF NOT EXISTS message;
CREATE SEQUENCE IF NOT EXISTS member.member_code_seq;

-- 2. Master Store (Public)
CREATE TABLE IF NOT EXISTS public."msStore" (
    "StoreCode" VARCHAR(10) PRIMARY KEY,
    "Description" VARCHAR(100) NOT NULL,
    "Address" TEXT,
    "City" VARCHAR(50),
    "Phone" VARCHAR(30),
    "IsActive" SMALLINT DEFAULT 1
);

-- 3. Operators (Admin, Toko, Head/Direksi)
CREATE TABLE IF NOT EXISTS admpanel."msOperator" (
    "idMsOperator" SERIAL PRIMARY KEY,
    "LoginName" VARCHAR(32) UNIQUE NOT NULL,
    "LoginPass" VARCHAR(255) NOT NULL,
    "FullName" VARCHAR(100) NOT NULL,
    "Role" VARCHAR(20) NOT NULL CHECK ("Role" IN ('ADMIN', 'TOKO', 'HEAD')),
    "StoreCode" VARCHAR(10) REFERENCES public."msStore"("StoreCode") ON DELETE SET NULL,
    "Email" VARCHAR(150),
    "PhoneNumber" VARCHAR(50),
    "isActive" SMALLINT DEFAULT 1,
    "isSuperUser" SMALLINT DEFAULT 0,
    "LastUpdate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3a. Tabel Kontrol Akses Portal (dikelola dari database, tanpa ubah kode)
CREATE TABLE IF NOT EXISTS admpanel."msPortalAccess" (
    "idAccess" SERIAL PRIMARY KEY,
    "RoleCode" VARCHAR(20) NOT NULL UNIQUE, -- 'ADMIN', 'TOKO', 'HEAD', 'MEMBER', 'RESELLER', 'AGENT'
    "PortalName" VARCHAR(30) NOT NULL,       -- 'ADMIN_PORTAL', 'MEMBER_PORTAL'
    "AllowAdminPortal" SMALLINT DEFAULT 0,
    "AllowMemberPortal" SMALLINT DEFAULT 1,
    "Description" VARCHAR(100),
    "IsActive" SMALLINT DEFAULT 1
);

-- 4. Action Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS admpanel."trActionLog" (
    "idActionLog" BIGSERIAL PRIMARY KEY,
    "fidMsOperator" INT REFERENCES admpanel."msOperator"("idMsOperator") ON DELETE SET NULL,
    "FormCaller" VARCHAR(100),
    "ActionDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "Message" TEXT,
    "ValueBefore" TEXT,
    "ValueAfter" TEXT
);

-- 4a. Master Kategori Member (Member / Reseller / Agent)
CREATE TABLE IF NOT EXISTS member."msCategory" (
    "CategoryCode" VARCHAR(20) PRIMARY KEY,
    "CategoryName" VARCHAR(50) NOT NULL,
    "AllowSelfRegister" SMALLINT DEFAULT 0,
    "BenefitType" VARCHAR(30) DEFAULT 'POINT',
    "MaxDiscountPercent" NUMERIC(5,2) DEFAULT 0.00,
    "Description" TEXT,
    "IsActive" SMALLINT DEFAULT 1
);

-- 4b. Master Tier Dinamis (per Kategori)
CREATE TABLE IF NOT EXISTS member."msCategoryTier" (
    "idTier" SERIAL PRIMARY KEY,
    "CategoryCode" VARCHAR(20) REFERENCES member."msCategory"("CategoryCode") ON DELETE CASCADE,
    "TierCode" VARCHAR(20) NOT NULL,
    "TierName" VARCHAR(50) NOT NULL,
    "MinSpendingTarget" NUMERIC(16,2) DEFAULT 0.00,
    "DiscountPercent" NUMERIC(5,2) DEFAULT 0.00,
    "MinPoints" NUMERIC(16,0) DEFAULT 0,
    "IsActive" SMALLINT DEFAULT 1
);

-- 5. Master Member
CREATE TABLE IF NOT EXISTS member."Member" (
    "MemberCode" VARCHAR(11) PRIMARY KEY,
    "Handpone" VARCHAR(30) UNIQUE NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "Password" VARCHAR(255),
    "Email" VARCHAR(100),
    "Gender" SMALLINT DEFAULT 0,
    "DateOfBirth" DATE,
    "Address" TEXT,
    "City" VARCHAR(100),
    "StoreCode" VARCHAR(10) REFERENCES public."msStore"("StoreCode") ON DELETE SET NULL,
    "RegistrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "isActive" SMALLINT DEFAULT 1,
    "OTP" VARCHAR(6),
    "OTPExpiry" TIMESTAMP,
    "OTPAttempts" INT DEFAULT 0,
    "TierMember" VARCHAR(20) DEFAULT 'SILVER',
    "referralCode" VARCHAR(10),
    "CreatedBy" VARCHAR(50) DEFAULT 'SYSTEM',
    "LastUpdate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5a. Tambahkan Kolom Kategori & Pencapaian Belanja ke Tabel Member
ALTER TABLE member."Member" 
ADD COLUMN IF NOT EXISTS "MemberCategory" VARCHAR(20) DEFAULT 'MEMBER',
ADD COLUMN IF NOT EXISTS "TotalSpending" NUMERIC(16,2) DEFAULT 0.00;

-- 6. Member Points Currently (Real-time Balance)
CREATE TABLE IF NOT EXISTS member."MemberPointsCurrently" (
    "MemberCode" VARCHAR(11) PRIMARY KEY REFERENCES member."Member"("MemberCode") ON DELETE CASCADE,
    "TotalPoints" NUMERIC(16,0) DEFAULT 0,
    "LastUpdate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Member Devices
CREATE TABLE IF NOT EXISTS member."MemberDevice" (
    "DeviceToken" TEXT PRIMARY KEY,
    "MemberCode" VARCHAR(11) REFERENCES member."Member"("MemberCode") ON DELETE CASCADE,
    "isLogin" SMALLINT DEFAULT 1,
    "lastUpdate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Referral Relations
CREATE TABLE IF NOT EXISTS member."referral" (
    "memberCode" VARCHAR(11) PRIMARY KEY REFERENCES member."Member"("MemberCode") ON DELETE CASCADE,
    "referralCode" VARCHAR(10),
    "memberCodeParent" VARCHAR(11),
    "lastUpdate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Points Ledger (Mutasi Poin)
CREATE TABLE IF NOT EXISTS points."Points" (
    "IdRec" BIGSERIAL PRIMARY KEY,
    "MemberCode" VARCHAR(11) REFERENCES member."Member"("MemberCode") ON DELETE CASCADE,
    "TransNumRef" VARCHAR(50),
    "TransType" SMALLINT DEFAULT 1, -- 1: Earn, 2: Redeem, 3: Adjustment, 4: Expired
    "Debit" NUMERIC(16,0) DEFAULT 0,
    "Credit" NUMERIC(16,0) DEFAULT 0,
    "Description" VARCHAR(255),
    "CreateBy" VARCHAR(100) DEFAULT 'SYSTEM',
    "CreateTime" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Point Gift Redemption Catalog
CREATE TABLE IF NOT EXISTS points."PointGiftRedeemption" (
    "GiftId" SERIAL PRIMARY KEY,
    "GiftDescription" VARCHAR(255) NOT NULL,
    "GiftAmount" NUMERIC(18,2) DEFAULT 0,
    "PointQuantity" INT NOT NULL,
    "Stock" INT DEFAULT 100,
    "isActive" SMALLINT DEFAULT 1,
    "ImagePath" TEXT,
    "ExpiryDays" INT DEFAULT 30,
    "Category" VARCHAR(30) DEFAULT 'Voucher'
);

-- 11. Point Adjustment Audit Log
CREATE TABLE IF NOT EXISTS points."PointAdjustmentLog" (
    "idAdjustment" BIGSERIAL PRIMARY KEY,
    "MemberCode" VARCHAR(11) REFERENCES member."Member"("MemberCode") ON DELETE CASCADE,
    "fidMsOperator" INT REFERENCES admpanel."msOperator"("idMsOperator") ON DELETE SET NULL,
    "AdjustmentType" VARCHAR(10) NOT NULL, -- 'ADD', 'DEDUCT'
    "PointsNominal" NUMERIC(16,0) NOT NULL,
    "Reason" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Vouchers Master & Member Vouchers
CREATE TABLE IF NOT EXISTS voucher."Voucher" (
    "VoucherId" VARCHAR(30) PRIMARY KEY,
    "MemberCode" VARCHAR(11) REFERENCES member."Member"("MemberCode") ON DELETE CASCADE,
    "PromoCode" VARCHAR(30),
    "Title" VARCHAR(100) NOT NULL,
    "VoucherAmount" NUMERIC(16,2) DEFAULT 0,
    "ExpiryDate" DATE,
    "UniqueCode" VARCHAR(20) UNIQUE NOT NULL,
    "fidVoucherStatus" SMALLINT DEFAULT 1, -- 1: Active, 2: Used, 3: Expired
    "CreatedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UsedDate" TIMESTAMP,
    "GiftId" INT REFERENCES points."PointGiftRedeemption"("GiftId") ON DELETE SET NULL
);

-- 13. Voucher Categories
CREATE TABLE IF NOT EXISTS voucher."VoucherCategory" (
    "idCategory" SERIAL PRIMARY KEY,
    "Description" VARCHAR(50) NOT NULL
);

-- 14. Master Promo
CREATE TABLE IF NOT EXISTS promo."msPromo" (
    "PromoCode" VARCHAR(30) PRIMARY KEY,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT,
    "StartPromo" DATE,
    "EndPromo" DATE,
    "BannerUrl" TEXT,
    "isActive" SMALLINT DEFAULT 1
);

-- 15. Notification / OTP Log
CREATE TABLE IF NOT EXISTS message."trNotify" (
    "idNotify" BIGSERIAL PRIMARY KEY,
    "MemberCode" VARCHAR(11),
    "Title" VARCHAR(150),
    "Content" TEXT,
    "NotifyType" SMALLINT DEFAULT 1, -- 1: OTP, 2: Info, 3: Voucher
    "NotifyStatus" SMALLINT DEFAULT 1,
    "CreateTime" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Banners (Public)
CREATE TABLE IF NOT EXISTS public."Banner" (
    "idBanner" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL,
    "ImagePath" TEXT NOT NULL,
    "Link" TEXT,
    "Order" INT DEFAULT 0,
    "isActive" SMALLINT DEFAULT 1
);

-- =========================================================
-- INITIAL SEED DATA
-- =========================================================

-- Stores
INSERT INTO public."msStore" ("StoreCode", "Description", "Address", "City", "Phone", "IsActive")
VALUES 
('STR01', 'Store Central Jakarta', 'Jl. Sudirman No. 12', 'Jakarta Pusat', '021-5550101', 1),
('STR02', 'Store Bandung Merdeka', 'Jl. Merdeka No. 45', 'Bandung', '022-4440202', 1),
('STR03', 'Store Surabaya Tunjungan', 'Jl. Tunjungan No. 88', 'Surabaya', '031-3330303', 1)
ON CONFLICT ("StoreCode") DO NOTHING;

-- Operators (Password bcrypt hash for 'admin123', 'toko123', 'head123')
INSERT INTO admpanel."msOperator" ("LoginName", "LoginPass", "FullName", "Role", "StoreCode", "Email", "PhoneNumber", "isActive", "isSuperUser")
VALUES 
('admin', '$2a$10$4.z4Z2nO2YmZ1cR6x.yO7uR7v1z0.bW2xY3z4Z5a6b7c8d9e0f1a', 'Administrator CRM', 'ADMIN', 'STR01', 'admin@crmloyalty.id', '081234567890', 1, 1),
('toko_jkt', '$2a$10$4.z4Z2nO2YmZ1cR6x.yO7uR7v1z0.bW2xY3z4Z5a6b7c8d9e0f1a', 'Kasir Store Jakarta', 'TOKO', 'STR01', 'toko.jkt@crmloyalty.id', '081234567891', 1, 0),
('head_direksi', '$2a$10$4.z4Z2nO2YmZ1cR6x.yO7uR7v1z0.bW2xY3z4Z5a6b7c8d9e0f1a', 'Direktur Operasional', 'HEAD', NULL, 'head@crmloyalty.id', '081234567892', 1, 1)
ON CONFLICT ("LoginName") DO NOTHING;

-- Role mana saja yang boleh masuk Portal Admin / Portal Member
INSERT INTO admpanel."msPortalAccess" ("RoleCode", "PortalName", "AllowAdminPortal", "AllowMemberPortal", "Description")
VALUES
('ADMIN',    'ADMIN_PORTAL', 1, 0, 'Admin penuh, hanya bisa akses portal admin'),
('TOKO',     'ADMIN_PORTAL', 1, 0, 'Karyawan toko, hanya bisa akses portal admin'),
('HEAD',     'ADMIN_PORTAL', 1, 0, 'Direksi/Head, hanya bisa akses portal admin'),
('MEMBER',   'MEMBER_PORTAL', 0, 1, 'Member biasa, hanya bisa akses portal member'),
('RESELLER', 'MEMBER_PORTAL', 0, 1, 'Reseller, hanya bisa akses portal member'),
('AGENT',    'MEMBER_PORTAL', 0, 1, 'Agent, hanya bisa akses portal member')
ON CONFLICT ("RoleCode") DO NOTHING;

-- Master Kategori Member (Member, Reseller, Agent)
INSERT INTO member."msCategory" ("CategoryCode", "CategoryName", "AllowSelfRegister", "BenefitType", "MaxDiscountPercent", "Description")
VALUES 
('MEMBER', 'Member Regular', 1, 'POINT', 0.00, 'Member umum, akumulasi poin & reward catalog'),
('RESELLER', 'Mitra Reseller', 0, 'DISCOUNT_ACHIEVEMENT', 20.00, 'Mitra Reseller, diskon s/d 20% berdasarkan achievement'),
('AGENT', 'Mitra Agen', 0, 'DISCOUNT_ACHIEVEMENT', 30.00, 'Mitra Agen, diskon s/d 30% berdasarkan achievement')
ON CONFLICT ("CategoryCode") DO NOTHING;

-- Master Tier Achievement per Kategori
INSERT INTO member."msCategoryTier" ("CategoryCode", "TierCode", "TierName", "MinSpendingTarget", "DiscountPercent", "MinPoints")
VALUES 
('MEMBER', 'SILVER', 'Silver Member', 0, 0, 0),
('MEMBER', 'GOLD', 'Gold Member', 0, 0, 500),
('MEMBER', 'PLATINUM', 'Platinum Member', 0, 0, 1500),
('RESELLER', 'TIER_1', 'Reseller Level 1 (Diskon 10%)', 5000000.00, 10.00, 0),
('RESELLER', 'TIER_2', 'Reseller Level 2 (Diskon 20%)', 15000000.00, 20.00, 0),
('AGENT', 'TIER_1', 'Agen Level 1 (Diskon 10%)', 10000000.00, 10.00, 0),
('AGENT', 'TIER_2', 'Agen Level 2 (Diskon 30%)', 30000000.00, 30.00, 0)
ON CONFLICT DO NOTHING;

-- Seed Sample Member
INSERT INTO member."Member" ("MemberCode", "Handpone", "Name", "Email", "Gender", "DateOfBirth", "City", "StoreCode", "TierMember", "referralCode", "OTP")
VALUES 
('MBR00000001', '081299998888', 'Budi Santoso', 'budi@example.com', 1, '1995-05-15', 'Jakarta', 'STR01', 'GOLD', 'REF123', '123456'),
('MBR00000002', '081277776666', 'Siti Rahma', 'siti@example.com', 2, '1998-08-20', 'Bandung', 'STR02', 'SILVER', 'REF456', '123456')
ON CONFLICT ("MemberCode") DO NOTHING;
SELECT setval(
  'member.member_code_seq',
  COALESCE(
    (SELECT MAX(RIGHT("MemberCode", 8)::BIGINT) FROM member."Member"),
    0
  ),
  true
);

INSERT INTO member."MemberPointsCurrently" ("MemberCode", "TotalPoints", "LastUpdate")
VALUES 
('MBR00000001', 1250, CURRENT_TIMESTAMP),
('MBR00000002', 350, CURRENT_TIMESTAMP)
ON CONFLICT ("MemberCode") DO NOTHING;

-- Seed Sample Point Mutasi
INSERT INTO points."Points" ("MemberCode", "TransNumRef", "TransType", "Debit", "Credit", "Description", "CreateBy")
VALUES 
('MBR00000001', 'TRX20260701001', 1, 1000, 0, 'Pembelian Kasir STR01', 'SYSTEM'),
('MBR00000001', 'TRX20260715002', 1, 500, 0, 'Bonus Registrasi Member', 'SYSTEM'),
('MBR00000001', 'RDM20260720001', 2, 0, 250, 'Redeem Voucher Diskon Rp 25.000', 'BUDI SANTOSO'),
('MBR00000002', 'TRX20260710001', 1, 350, 0, 'Pembelian Kasir STR02', 'SYSTEM')
ON CONFLICT DO NOTHING;

-- Seed Sample Point Gift Catalog
INSERT INTO points."PointGiftRedeemption" ("GiftDescription", "GiftAmount", "PointQuantity", "Stock", "isActive", "ImagePath", "ExpiryDays")
VALUES 
('Voucher Diskon Rp 25.000', 25000, 250, 100, 1, '/assets/rewards/voucher25k.png', 30),
('Voucher Diskon Rp 50.000', 50000, 480, 50, 1, '/assets/rewards/voucher50k.png', 30),
('Voucher Diskon Rp 100.000', 100000, 900, 20, 1, '/assets/rewards/voucher100k.png', 60),
('Exclusive Tumbler CRM', 150000, 1200, 15, 1, '/assets/rewards/tumbler.png', 90)
ON CONFLICT DO NOTHING;

-- Seed Sample Banner
INSERT INTO public."Banner" ("Title", "ImagePath", "Link", "Order", "isActive")
VALUES 
('Promo Spesial Tahun Baru 2026', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800', '/reward', 1, 1),
('Double Poin Setiap Akhir Pekan', 'https://images.unsplash.com/photo-1556742049-0a670fc80799?q=80&w=800', '/poin-saya', 2, 1)
ON CONFLICT DO NOTHING;

-- Seed Sample Vouchers
INSERT INTO voucher."Voucher" ("VoucherId", "MemberCode", "PromoCode", "Title", "VoucherAmount", "ExpiryDate", "UniqueCode", "fidVoucherStatus")
VALUES 
('VCH20260720001', 'MBR00000001', 'PROMO25K', 'Voucher Diskon Rp 25.000', 25000, '2026-08-20', 'VCH-987654321', 1)
ON CONFLICT ("VoucherId") DO NOTHING;