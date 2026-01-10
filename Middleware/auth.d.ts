import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
        organizationId?: string;
    };
}
export declare function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function requireRole(roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map