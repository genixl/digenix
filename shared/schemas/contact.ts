import { z } from 'zod'

/**
 * Single source of truth for the contact form payload, shared by the
 * Nitro handler and the frontend UForm. The service must match a
 * published service; the server checks that against the database.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name is too long'),

  email: z
    .email({ error: 'Please enter a valid email address' })
    .max(254, 'Email is too long'),

  company: z
    .string({ error: 'Company is required' })
    .trim()
    .min(2, 'Company must be at least 2 characters')
    .max(160, 'Company is too long'),

  service: z
    .string({ error: 'Choose the service you need' })
    .trim()
    .min(1, 'Choose the service you need')
    .max(120, 'Choose the service you need'),

  message: z
    .string({ error: 'Tell us about your project' })
    .trim()
    .min(20, 'Give us a little more detail (at least 20 characters)')
    .max(2000, 'Keep it under 2000 characters')
})

export type ContactPayload = z.infer<typeof contactSchema>
