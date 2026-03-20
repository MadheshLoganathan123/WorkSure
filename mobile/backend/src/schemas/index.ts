// ── Example Schemas ──────────────────────────────────────────────────────
// Add your Zod schemas here as you build out routes.
//
// Usage:
//   import { mySchema } from '../schemas';
//   router.post('/endpoint', validate(mySchema, 'body'), controller.handler);
//
// Example:
//   import { z } from 'zod';
//   export const createClaimSchema = z.object({
//     policyId: z.string().min(1, 'Policy ID is required'),
//     amount: z.number().positive('Amount must be positive'),
//     description: z.string().optional(),
//   });

export {};
