import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
