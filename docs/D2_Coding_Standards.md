# D2 Coding Standards

เอกสารนี้สรุปมาตรฐานการเขียนโค้ดสำหรับ D2 (Design & Architecture Baseline)

## 1. Naming
- ตัวแปร/ฟังก์ชัน: camelCase
- React component/class: PascalCase
- Constant: UPPER_SNAKE_CASE
- ไฟล์ backend route/controller: kebab-case.suffix.js

## 2. Backend Conventions
- ใช้ const/let ห้ามใช้ var
- ใช้ async/await และต้องมี error handling
- route file เก็บเฉพาะ routing logic
- business logic อยู่ใน controller
- validate input ด้วย Zod ก่อนเข้า logic
- SQL ต้องเป็น parameterized query

## 3. Frontend Conventions
- ใช้ function component
- hooks ต้องอยู่ top-level
- ห้าม mutate state โดยตรง
- API call ผ่าน axios client กลาง

## 4. API Response Style
- success response:
  - success: true
  - message: string 
  - data: object/array
- error response:
  - success: false
  - message: string
  - details: optional

## 5. Security Rules
- เก็บ secret ใน .env เท่านั้น
- ห้าม commit .env
- hash password ด้วย bcrypt
- ใช้ requireAuth + requireRole กับ protected routes

## 6. Git & PR Rules
- ทำงานผ่าน feature branch
- ใช้ conventional-like commit message
- PR ต้องผ่าน review อย่างน้อย 1 คน
- CI และ test ต้องผ่านก่อน merge

## 7. Testing Baseline
- ต้องมี unit test สำหรับ validator/middleware สำคัญ
- ต้องมี integration test สำหรับ API หลัก
- coverage report ต้อง generate ได้จากคำสั่ง test:coverage

