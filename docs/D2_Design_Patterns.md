# D2 Design Patterns

## 1. MVC-style Separation
- Model: โครงสร้างข้อมูลใน MySQL schema
- Controller: ตรรกะใน backend/src/controllers
- Route/View API: การแมป endpoint ใน backend/src/routes

ประโยชน์:
- แยกความรับผิดชอบชัดเจน
- แก้ไข logic โดยไม่กระทบ routing

## 2. Middleware Pattern (Express)
ใช้ middleware เป็น cross-cutting concerns:
- requireAuth: ตรวจ JWT
- requireRole: ตรวจสิทธิ์ตาม role
- errorHandler/notFoundHandler: จัดการข้อผิดพลาดรวมศูนย์

ประโยชน์:
- ลดโค้ดซ้ำ
- คุม policy ความปลอดภัยได้สม่ำเสมอ

## 3. Validation Pattern (Schema-first with Zod)
- auth.validator.js
- event.validator.js


## 4. Transaction Script Pattern (Registration flow)
ในกรณีสมัคร/ยกเลิกกิจกรรม ใช้ transaction ภายใน controller เพื่อรักษาความถูกต้องของข้อมูล:
- beginTransaction
- query หลายขั้น
- commit/rollback

ประโยชน์:
- ป้องกันข้อมูลไม่สอดคล้องเมื่อเกิด race condition

## 5. Context Provider Pattern (Frontend)
- AuthContext จัดการ token และ user state กลาง
- ProtectedRoute กันหน้า private route

ประโยชน์:
- state ด้าน auth ถูกใช้งานร่วมกันได้ทั้งแอป
- ลด prop drilling

## 6. HTTP Client Abstraction Pattern
- frontend/src/api/client.js ใช้ axios instance กลาง
- รวม baseURL และ interceptors ไว้จุดเดียว

ประโยชน์:
- เปลี่ยน config การเรียก API ได้ง่าย
- จัดการ auth header และ error handling ได้เป็นมาตรฐาน
