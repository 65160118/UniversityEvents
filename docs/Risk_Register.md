# Risk Register — ระบบจัดการกิจกรรมมหาวิทยาลัย

**อัปเดตล่าสุด:** 22 มีนาคม 2026  

---

## ระดับความเสี่ยง

| ระดับ | Likelihood × Impact | สี |
|-------|--------------------|----|
| Critical | High × High | 🔴 |
| High | High × Medium หรือ Medium × High | 🟠 |
| Medium | Medium × Medium | 🟡 |
| Low | Low × Any | 🟢 |

---

## รายการความเสี่ยง

### R-01 — ฐานข้อมูลขัดข้อง / ข้อมูลสูญหาย
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Technical |
| **คำอธิบาย** | MySQL container หยุดทำงานโดยไม่คาดคิด ทำให้ข้อมูลกิจกรรมและการสมัครสูญหาย |
| **Likelihood** | Medium |
| **Impact** | High |
| **ระดับ** | 🟠 High |
| **มาตรการป้องกัน** | ตั้งค่า Docker volume สำหรับ persistent storage, ทำ backup schema.sql ไว้ใน repo |
| **มาตรการแก้ไข** | restore จาก backup, re-run seeds.sql |
| **Owner** | QA / DevOps |
| **สถานะ** | กำลังดำเนินการ |

---

### R-02 — JWT Secret รั่วไหลสู่ Public Repository
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Security |
| **คำอธิบาย** | สมาชิกทีม commit ไฟล์ `.env` ที่มี JWT_SECRET และ DB credentials ลง GitHub โดยไม่ตั้งใจ |
| **Likelihood** | Medium |
| **Impact** | High |
| **ระดับ** | 🟠 High |
| **มาตรการป้องกัน** | ใส่ `.env` ใน `.gitignore`, ใช้ `.env.example` เป็น template, ตรวจสอบ pre-commit hook |
| **มาตรการแก้ไข** | Revoke/rotate JWT_SECRET ทันที, force-push rewrite history หรือ invalidate ทุก token |
| **Owner** | Scrum Master |
| **สถานะ** | มีมาตรการป้องกันแล้ว (.gitignore) |

---

### R-03 — SQL Injection จาก Input ที่ไม่ได้ Sanitize
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Security |
| **คำอธิบาย** | นักพัฒนาใช้ string concatenation ใน query แทน parameterized query ทำให้ผู้ไม่ประสงค์ดีเข้าถึง DB ได้ |
| **Likelihood** | Low |
| **Impact** | High |
| **ระดับ** | 🟠 High |
| **มาตรการป้องกัน** | Coding Standards กำหนดให้ใช้ parameterized query เสมอ, Code Review Checklist ตรวจ |
| **มาตรการแก้ไข** | แก้ query ทันที, ตรวจสอบ DB logs, reset credentials |
| **Owner** | Developer |
| **สถานะ** | มีมาตรการป้องกันแล้ว (Coding Standards) |

---

### R-04 — Race Condition ในการสมัครกิจกรรม
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Technical |
| **คำอธิบาย** | นิสิตหลายคน request สมัครกิจกรรมพร้อมกันเมื่อที่นั่งเหลือ 1 ที่ ทำให้อาจลงทะเบียนเกินจำนวน |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **ระดับ** | 🟡 Medium |
| **มาตรการป้องกัน** | ใช้ MySQL transaction + `SELECT ... FOR UPDATE` row lock ในระหว่าง register |
| **มาตรการแก้ไข** | ตรวจ registrations table, ยกเลิก registration ที่เกิน, แจ้งผู้ใช้ |
| **Owner** | Developer |
| **สถานะ** | แก้ไขแล้ว (transaction ใน registerForEvent) |

---

### R-05 — Frontend-Backend API Contract ไม่ตรงกัน
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Process |
| **คำอธิบาย** | ทีม Frontend และ Backend ทำงานแยกกัน ทำให้ field name หรือ response format ไม่ตรงกัน |
| **Likelihood** | High |
| **Impact** | Medium |
| **ระดับ** | 🟠 High |
| **มาตรการป้องกัน** | กำหนด API response format มาตรฐานใน Coding_Standards.md, ทำ integration test |
| **มาตรการแก้ไขแล้ว** | Code Review ร่วม Frontend+Backend ก่อน merge |
| **Owner** | QA / DevOps |
| **สถานะ** | กำลังดำเนินการ |

---

### R-06 — Token หมดอายุระหว่าง Session
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Technical |
| **คำอธิบาย** | JWT หมดอายุขณะผู้ใช้ยังใช้งานอยู่ ทำให้ API calls ล้มเหลวด้วย 401 โดยไม่มีคำอธิบาย |
| **Likelihood** | Medium |
| **Impact** | Low |
| **ระดับ** | 🟢 Low |
| **มาตรการป้องกัน** | Frontend interceptor ตรวจ 401 และ redirect ไป login พร้อมข้อความแจ้ง |
| **มาตรการแก้ไข** | เพิ่ม refresh token mechanism ในอนาคต |
| **Owner** | QA / DevOps |
| **สถานะ** | บางส่วนแล้ว (Axios interceptor) |

---

### R-07 — ระบบใช้งานได้เฉพาะ Local (ไม่มี Production Deployment)
| หัวข้อ | รายละเอียด |
|--------|-----------|
| **ประเภท** | Operational |
| **คำอธิบาย** | ระบบยังไม่ได้ deploy ขึ้น server จริง ทำให้ไม่สามารถสาธิตให้ผู้ใช้จริงใช้ได้ |
| **Likelihood** | High |
| **Impact** | Medium |
| **ระดับ** | 🟠 High |
| **มาตรการป้องกัน** | มี Docker Compose สำหรับ local run, เตรียม CI/CD pipeline |
| **มาตรการแก้ไข** | Deploy บน Cloud platform (e.g., Railway, Render, VPS) |
| **Owner** | QA / DevOps |
| **สถานะ** | Backlog |

---

## Risk Summary Matrix

| Risk ID | ชื่อ | ระดับ | สถานะ |
|---------|------|-------|-------|
| R-01 | DB ขัดข้อง | 🟠 High | กำลังดำเนินการ |
| R-02 | JWT Secret รั่ว | 🟠 High | มีมาตรการแล้ว |
| R-03 | SQL Injection | 🟠 High | มีมาตรการแล้ว |
| R-04 | Race Condition | 🟡 Medium | แก้ไขแล้ว |
| R-05 | API Contract ไม่ตรง | 🟠 High | กำลังดำเนินการ |
| R-06 | Token หมดอายุ | 🟢 Low | บางส่วน |
| R-07 | ไม่มี Production Deploy | 🟠 High | Backlog |
