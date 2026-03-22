# D3 Test Plan — ระบบจัดการกิจกรรมมหาวิทยาลัย

## 1. วัตถุประสงค์การทดสอบ
- ตรวจสอบพฤติกรรม API ฝั่ง backend สำหรับการยืนยันตัวตน (authentication), lifecycle ของกิจกรรม, การอนุมัติ, และการลงทะเบียนนักศึกษา
- ยืนยันว่า authorization ตามบทบาท (role-based) ทำงานถูกต้อง
- รักษา automated regression safety net โดยตั้งเป้าหมาย coverage ไม่น้อยกว่า 80% (scope: โมดูลสำคัญ)

## 2. ขอบเขต
- in scope:
  - unit tests: validators, JWT utility, role middleware
  - integration tests: auth, events, approvals, registrations, health route
- out of scope (D4+):
  - browser end-to-end UI automation
  - load testing ที่ระดับ production-scale traffic

## 3. ประเภทการทดสอบ
- unit testing (Jest)
- integration testing (Jest + Supertest)
- static lint check (ESLint)

## 4. สภาพแวดล้อมการทดสอบ
- Node.js: 20.x
- test runner: Jest 29
- HTTP test client: Supertest
- DB dependency ใน integration tests: mocked ผ่าน Jest module mocks
- OS: Windows / Ubuntu (GitHub Actions)

## 5. เงื่อนไขก่อนเริ่ม (Entry Criteria)
- ติดตั้ง dependencies ฝั่ง backend แล้ว (`npm ci`)
- มี test scripts ใน backend/package.json
- คอนฟิก Jest พร้อมใช้งาน (`backend/jest.config.js`)

## 6. เกณฑ์ปิดงาน (Exit Criteria)
- test suite ทั้งหมดผ่าน
- ไม่มี lint errors ที่บล็อค
- สร้างรายงาน coverage แล้ว (`coverage/`)
- ตรวจ regression สำคัญผ่าน:
  - request ที่ไม่ผ่าน auth ต้องได้ 401
  - เข้าถึงด้วย role ที่ไม่ได้รับอนุญาตต้องได้ 403
  - validation errors ต้องได้ 400

## 7. คำสั่งรันการทดสอบ
```bash
cd backend
npm run test:unit
npm run test:integration
npm run test:coverage
npm run lint
```

## 8. ความเสี่ยงและแนวทางลดผลกระทบ
- ความเสี่ยง: integration tests พึ่งพาสถานะ DB จริง
  - แนวทางลดผลกระทบ: mock DB module ใน integration suite
- ความเสี่ยง: เกิด false confidence ใน SQL branch ที่ซับซ้อน
  - แนวทางลดผลกระทบ: เพิ่ม repository/service layer tests ใช้ DB container ในเฟสถัดไป

## 9. ผลลัพธ์ที่ส่งมอบ
- ไฟล์ test ที่อยู่ใน `backend/tests/`
- คอนฟิก Jest ที่ `backend/jest.config.js`
- artifact coverage ใน `coverage/`
- เอกสาร D3 ภายใน `docs/`
