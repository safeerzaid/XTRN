import { z } from 'zod'

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    fullName:     z.string().trim().min(2, 'Full name is required'),
    phone:        z.string().trim().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    addressLine1: z.string().trim().min(3, 'Address is required'),
    addressLine2: z.string().trim().optional(),
    city:         z.string().trim().min(2, 'City is required'),
    state:        z.string().trim().min(2, 'State is required'),
    pincode:      z.string().trim().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  }),
  paymentMethod: z.enum(['cod', 'razorpay']).default('cod'),
})