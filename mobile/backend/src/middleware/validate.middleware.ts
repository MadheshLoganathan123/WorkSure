import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Generic Zod validation middleware (compatible with Zod v4).
 *
 * @param schema  - A Zod object schema to validate against.
 * @param target  - Which part of the request to validate ('body' | 'query' | 'params').
 *
 * @example
 *   router.post('/claim', validate(createClaimSchema, 'body'), claimController.create);
 *   router.get('/claims', validate(listClaimsQuery, 'query'), claimController.list);
 */
export const validate = (schema: z.ZodObject<any>, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const validationError: any = new Error('Validation failed');
      validationError.statusCode = 400;
      validationError.details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      next(validationError);
      return;
    }

    // Replace the target with the parsed (and coerced) data
    (req as any)[target] = result.data;
    next();
  };
};
