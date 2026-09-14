import {z} from 'zod'

export const signupSchema = z.object({
  name:z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password:z.string().min(8)
})

const result = signupSchema.safeParse({
  name: "Safeer",
  email: "safeer@gmail.com",
  password: "password123",
});

