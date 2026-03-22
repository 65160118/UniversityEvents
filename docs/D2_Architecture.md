# D2 Architecture

## 1. System Overview
ระบบนี้เป็นเว็บแอปสำหรับจัดการกิจกรรมมหาวิทยาลัย แบ่งเป็น 3 ส่วนหลัก:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

## 2. Logical Architecture
- Presentation Layer: หน้า Login, Register, Dashboard
- Application Layer: Controller + Middleware + Validator
- Data Layer: MySQL tables (users, events, registrations, approvals, feedback)

## 3. Current Project Structure Mapping
- frontend/src/pages: UI screens
- frontend/src/context: authentication state
- backend/src/routes: API routing
- backend/src/controllers: business logic
- backend/src/middlewares: auth, role, error handling
- backend/src/validators: request validation (Zod)
- backend/database/schema.sql: relational schema

## 4. Request Flow 
1. ผู้ใช้ล็อกอินจาก Frontend
2. Frontend ส่ง request ไป Backend API
3. Backend ตรวจ token ผ่าน middleware
4. Controller ตรวจข้อมูลผ่าน validator
5. Controller ทำงานกับฐานข้อมูล
6. Backend ส่ง response กลับ Frontend

## 5. Security Architecture
- JWT authentication สำหรับ protected routes
- Role-based authorization (STUDENT, LECTURER, ADMIN)
- Input validation ด้วย Zod
- Password hashing ด้วย bcryptjs

## 6. Deployment Baseline
- Local development: Docker Compose (MySQL + phpMyAdmin)
- Backend run: port 5001
- Frontend run: port 5173
- Database host port: 3307

## 7. NFR Snapshot
- Maintainability: แยกโฟลเดอร์ชัดเจนตามหน้าที่
- Testability: มี unit/integration tests ด้วย Jest + Supertest
- Security: ลดความเสี่ยงด้วย validation และ parameterized queries
