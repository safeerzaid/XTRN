import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  topic: z.enum(['Order', 'Payment', 'Shipping', 'Returns', 'Account', 'Product', 'Other'], {
    errorMap: () => ({ message: "Please select a valid topic" })
  }),
  orderId: z.string().trim().max(40, "Order ID must not exceed 40 characters").optional().or(z.literal('')),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must not exceed 1000 characters"),
  website: z.string().optional().or(z.literal('')) // honeypot
});
