# 🏪 Sor Chanchai Stock & POS API

## Requirements Checklist

- [x] Core API ด้วย Fastify + TypeScript
- [x] Custom Authentication & Session Management (Login/Logout/Logout-all)
- [x] ระบบจัดการสินค้า (เพิ่มสินค้า, Soft Delete, ระบุตำแหน่ง Warehouse/Shelf)
- [x] ระบบ Update Stock สินค้า (เพิ่มเข้าคลัง, ขึ้นชั้นวาง, Bulk Update)
- [x] ระบบขายสินค้าหน้าร้าน (POS Checkout) พร้อม Database Transaction
- [x] ระบบสมาชิก และ สะสมแต้ม (ซื้อทุก 25 บาท = 1 แต้ม ปัดเศษลง)
- [x] ระบบสรุปยอดขาย (สรุปยอดตามวัน, เดือน, ปี, ช่วงเวลา, รายสินค้า)
- [x] ระบบประวัติและ Audit Log (การขาย, การ update stock, Login/Logout)
- [x] ออกแบบโครงสร้างตามหลัก OOP (Abstract Class, Encapsulation, Inheritance, Access Modifiers, Generic)
- [x] API Validation ด้วย Zod + Standard Response DTO & Error Handling (4xx/5xx)
- [x] ระบบ Pagination สำหรับรายการสินค้า (หน้าละ 5, 10, 20+ รายการ)
- [ ] ระบบจัดการประเภทสินค้า (Category CRUD แยกเฉพาะ)
- [ ] Export รายงาน Stock สินค้าเป็นไฟล์ Excel (.xlsx)
- [ ] Update Stock สินค้าจากการอัปโหลดไฟล์ Excel
- [ ] ระบบออกใบเสร็จและหน้า View แสดงตัวอย่างใบเสร็จ
- [ ] ระบบนำแต้มสะสมมาแลกเป็นส่วนลด
- [ ] Upgrade ระบบเป็นสามารถซื้อขายแบบ Online ได้ (Customer Login / E-Commerce Challenge)

## Core Concepts

### ระบบความปลอดภัยและตัวตน (Authentication & Session Management)
* **Custom Auth:** ระบบ Login สำหรับ Cashier และ Admin ผ่าน Cookie/JWT Token พร้อมระบบยึดคืน Token (Logout & Logout All) เพื่อความปลอดภัย
* **Audit Identity:** บันทึกข้อมูล `cashier_id` ผู้ทำรายการทุกครั้งที่มีการขาย เติมสต๊อก หรือแก้ไขข้อมูลสินค้า

### การจัดการคลังสินค้าและตำแหน่งจัดวาง
* **Warehouse vs. Shelf:** แยกจำนวนสินค้าในคลังใหญ่ (`warehouse_qty`) และบนชั้นวางหน้าร้าน (`shelf_qty`) ออกจากกันชัดเจน
* **Location Mapping:** บันทึกตำแหน่งจัดวางทั้ง `warehouse_location` และ `shelf_location` ช่วยให้ซ้อจันทร์ฉายและลูกจ้างค้นหาสินค้าได้รวดเร็ว
* **Stock Lifecycle:** รองรับกระบวนการเพิ่มสินค้าเข้าคลัง (`addStock`) และย้ายสินค้าขึ้นชั้นวาง (`upShelf`)

### การประมวลผลการขายและระบบสมาชิก
* **Atomic Transaction Checkout:** เมื่อมีการขายหน้าร้าน ระบบจะทำรายการตัดสต๊อกบนชั้นวาง คำนวณราคารวม ส่วนลด และเพิ่มแต้มสมาชิกพร้อมกันใน Database Transaction เดียวกัน หากขั้นตอนใดล้มเหลว ข้อมูลจะถูก Rollback ทันที
* **Loyalty Point Formula:** คิดแต้มสะสมอัตโนมัติจากสูตร `Math.floor(totalAmount / 25)` (ทุกๆ 25 บาท รับ 1 แต้ม เศษปัดลง)

### ระบบวิเคราะห์ยอดขายและประวัติการทำงาน
* **Sales Analytics Summary:** สรุปยอดขายรวม (`totalRevenue`), จำนวนชิ้นที่ขายได้ (`totalItemsSold`), และจำนวนใบเสร็จ (`totalTransactions`) พร้อมกรองตามช่วงเวลา (วัน/เดือน/ปี) หรือจัดกลุ่มตามรายสินค้า
* **Audit Trail Log:** บันทึกประวัติกิจกรรมสำคัญลงใน `SystemLog` (Login, Logout, Add Stock, Up Shelf, Sale) เพื่อความโปร่งใสในการตรวจสอบย้อนหลัง

### สถาปัตยกรรมเชิงวัตถุและการจัดการข้อมูล (OOP Architecture & Validation)
* **OOP Core Principles:** ประยุกต์ใช้ Abstract Base Class (`BaseEntity`), Encapsulation (`getter/setter`), Inheritance (`extends`, `super`), Access Modifiers (`public`, `private`, `protected`, `readonly`) และ Generic Data Loaders (`<T>`)
* **Request Validation & Error Handling:** ใช้ Zod Schema ตรวจสอบ Query และ Body เสมอ พร้อม Throw Custom Error (4xx/5xx) และแปลงข้อมูลออกด้วย DTO Pattern

## Completed Features

* **System Structure & Configuration**
  * Setup โปรเจกต์ด้วย TypeScript + Fastify โครงสร้างแบบ Domain-driven Architecture (Controller, Service, Repository, Entity, DTO, Schema, Route)
  * ตั้งค่า Docker Compose สำหรับ PostgreSQL Database
  * ใช้ TypeORM สำหรับจัดการฐานข้อมูลแบบ ORM พร้อม Base Entity Pattern

* **Authentication System**
  * ระบบ Login / Register สำหรับ Cashier และ Admin
  * ระบบ Session Validation ผ่าน Middleware (`Authentication.validate`, `Authentication.validateAdmin`)
  * ระบบ Logout และ Logout All ทุกอุปกรณ์

* **Product & Stock Management**
  * CRUD เพิ่มและลบสินค้า (Soft Delete พร้อมบันทึก `deleted_by`)
  * ระบบแสดงรายการสินค้าพร้อม Pagination และ Filter ตามตำแหน่ง Warehouse/Shelf Location
  * ระบบเพิ่มสินค้าเข้าคลัง (`addStock`) และย้ายสินค้าขึ้นชั้นวาง (`upShelf`)
  * ระบบอัปเดตสต๊อกแบบกลุ่ม (`updateStockBulk`)

* **POS & Sales Management**
  * ระบบบันทึกการขายหน้าร้าน (Checkout) หักสต๊อกสินค้าบน Shelf อัตโนมัติ
  * การทำงานแบบ Database Transaction เพื่อความปลอดภัยของข้อมูล

* **Member & Loyalty System**
  * ระบบสมัครสมาชิกและค้นหาข้อมูลสมาชิกด้วยเบอร์โทรศัพท์
  * ระบบคำนวณและสะสมแต้มอัตโนมัติ (25 บาท = 1 แต้ม)

* **Summary / Stats Dashboard**
  * ระบบสรุปยอดขาย (`GET /api/transactions/summary`) ตามวัน, เดือน, ปี, ช่วงเวลา และรายสินค้า
  * ระบบบันทึก Log กิจกรรม (Login, Logout, Stock Operations, Sale Transactions)

## Tech Stack

* **Runtime:** Node.js
* **Language:** TypeScript
* **Framework:** Fastify
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Validation:** Zod
* **Container:** Docker & Docker Compose

## Setup & Run

1. **Start Database**
   ```bash
   npm run db:up
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```