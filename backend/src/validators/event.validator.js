const { z } = require('zod');

const createEventSchema = z.object({
  title: z.string().trim().min(1, 'กรุณาระบุชื่อกิจกรรม').max(255, 'ชื่อกิจกรรมยาวเกินกำหนด'),
  description: z.string().trim().max(4000, 'รายละเอียดกิจกรรมยาวเกินกำหนด').optional().default(''),
  eventDate: z.iso.datetime('รูปแบบวันเวลาไม่ถูกต้อง กรุณาใช้รูปแบบ ISO datetime'),
  location: z.string().trim().min(1, 'กรุณาระบุสถานที่').max(255, 'ชื่อสถานที่ยาวเกินกำหนด'),
  maxParticipants: z
    .number({
      error: 'กรุณาระบุจำนวนผู้เข้าร่วมสูงสุด',
    })
    .int('จำนวนผู้เข้าร่วมสูงสุดต้องเป็นจำนวนเต็ม')
    .positive('จำนวนผู้เข้าร่วมสูงสุดต้องมากกว่า 0'),
});

const updateApprovalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  remark: z.string().trim().max(2000, 'หมายเหตุยาวเกินกำหนด').optional().default(''),
});

const eventIdParamSchema = z.object({
  eventId: z.coerce.number().int().positive('รหัสกิจกรรมต้องเป็นจำนวนเต็มบวก'),
});

const checkInSchema = z.object({
  userId: z.coerce.number().int().positive('รหัสผู้ใช้ต้องเป็นจำนวนเต็มบวก'),
});

const feedbackSchema = z.object({
  rating: z
    .number({
      invalid_type_error: 'คะแนนต้องเป็นตัวเลขระหว่าง 1 ถึง 5',
    })
    .int('คะแนนต้องเป็นจำนวนเต็ม')
    .min(1, 'คะแนนต้องไม่น้อยกว่า 1')
    .max(5, 'คะแนนต้องไม่เกิน 5'),
  comment: z.string().trim().max(1000, 'ความเห็นยาวเกินกำหนด').optional().default(''),
});

module.exports = {
  createEventSchema,
  updateApprovalSchema,
  eventIdParamSchema,
  checkInSchema,
  feedbackSchema,
};
