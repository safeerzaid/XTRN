import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Member from '../models/Member.js';

const router = express.Router();

const memberLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per `window` (here, per hour)
  message: { message: 'Too many membership requests from this IP, please try again after an hour.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

const memberSchema = z.object({
  name: z.string().trim().max(80, "Name cannot exceed 80 characters"),
  email: z.string().trim().max(120, "Email cannot exceed 120 characters").email("Invalid email address"),
  phone: z.string().trim().optional(),
  sport: z.enum(['Running', 'Hiking', 'Gym', 'Football', 'Cricket', 'Other'], {
    errorMap: () => ({ message: "Invalid sport selection" })
  }),
  level: z.enum(['Beginner', 'Intermediate', 'Competitive'], {
    errorMap: () => ({ message: "Invalid experience level" })
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to receive community updates" })
  }),
}).strict();

router.post('/', memberLimiter, async (req, res) => {
  try {
    const validatedData = memberSchema.parse(req.body);

    const newMember = new Member(validatedData);
    await newMember.save();

    res.status(201).json({ message: 'Successfully joined the XTRN community!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: 'This email is already part of the XTRN community.' });
    }

    console.error('[Member Join Error]:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
});

export default router;
