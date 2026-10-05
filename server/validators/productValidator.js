import { z } from 'zod';

const safeString = z.string().trim().max(200).regex(/^[^<>]*$/, "HTML tags are not allowed");

export const productSchema = z.object({
  name: safeString.min(1, "Name is required"),
  brand: safeString.min(1, "Brand is required"),
  description: z.string().trim().max(2000).regex(/^[^<>]*$/, "HTML tags are not allowed").min(1, "Description is required"),
  price: z.preprocess((val) => (val === '' || val == null) ? undefined : Number(val), z.number().min(0).max(1000000)),
  originalPrice: z.preprocess((val) => {
    if (val === '' || val === null) return null;
    if (val === undefined) return undefined;
    return Number(val);
  }, z.number().min(0).max(1000000).nullable().optional()),
  gender: z.enum(['men', 'women', 'unisex']),
  department: z.array(z.enum(['men', 'women', 'sports', 'accessories'])).min(1),
  section: safeString.optional(),
  category: safeString.optional(),
  subcategory: safeString.optional(),
  sport: safeString.optional(),
  sizes: z.array(safeString).optional(),
  stock: z.preprocess((val) => (val === '' || val == null) ? undefined : Number(val), z.number().min(0).max(100000).optional()),
  images: z.any().optional(),
  discount: z.preprocess((val) => {
    if (val === '' || val === null) return null;
    if (val === undefined) return undefined;
    return Number(val);
  }, z.number().min(0).max(100).nullable().optional()),
  rating: z.number().min(0).max(5).optional(),
  featured: z.boolean().optional()
});
