import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(9, 'Phone number must be at least 9 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  message: z.string().optional(),
  service: z.enum(['cameras', 'keypad', 'alarm', 'combo', 'consultation'], {
    required_error: 'Please select a service',
  }),
  points: z.enum(['1-2', '3-4', '5-8', '9+', 'unknown'], {
    required_error: 'Please select number of points',
  }),
});

export const waitlistFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;