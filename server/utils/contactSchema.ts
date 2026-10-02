import { z } from 'zod'

export const contactServices = [
  'Web platforms',
  'Mobile apps',
  'Cloud & DevOps',
  'UI/UX design',
  'AI & automation',
  'Technical consulting',
  'Maintenance & support'
] as const

/**
 * Single source of truth for the contact form payload.
 * Exported from the Nitro server layer and imported directly
 * into the frontend UForm — no duplication.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters'),

  email: z
    .email({ error: 'Please enter a valid email address' }),

  company: z
    .string({ error: 'Company is required' })
    .trim()
    .min(2, 'Company must be at least 2 characters'),

  service: z
    .enum(contactServices, { error: 'Choose the service you need' }),

  message: z
    .string({ error: 'Tell us about your project' })
    .trim()
    .min(20, 'Give us a little more detail (at least 20 characters)')
    .max(2000, 'Keep it under 2000 characters')
})

export type ContactPayload = z.infer<typeof contactSchema>
