import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  persona: z.enum(['daily-wage', 'gig-worker', 'self-employed', 'domestic-worker'], {
    message: 'Persona must be one of: daily-wage, gig-worker, self-employed, domestic-worker',
  }),
  location: z.string().min(1, 'Location is required'),
  avgEarnings: z.number().positive('Average earnings must be positive'),
  workingHours: z.number().min(1).max(24, 'Working hours must be between 1 and 24'),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
