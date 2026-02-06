import { Request, Response, NextFunction } from "express";

/**
 * Middleware koji osigurava da je korisnik autentifikovan
 */

export function authMiddleware( req: Request, res: Response, next: NextFunction ) {
    const user = req.session.user;

    if(!user) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    next();
}

/***
 * Middleware koji osigurava da je trenutni korisnik admin
 */

export function adminMiddleware( req: Request, res: Response, next: NextFunction ) {
    const user = req.session.user;

    if(!user) {
        return res.status(401).json({
            error: "Authentication error"
        });
    }

    if ( user.role !== 'ADMIN' ) {
        return res.status(403).json({
            error: "Admin access required"
        });
    }

    next();
}

/**
 * Middleware koji osigurava da je korisnik profesor ili admin
 */

export function professorOrAdminMiddleware ( req: Request, res: Response, next: NextFunction ) {
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    if ( user.role !== "ADMIN" && user.role !== "PROFESSOR" ) {
        return res.status(403).json({
            error: "Professor or admin access required"
        });
    }

    next();
}