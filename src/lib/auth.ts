import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

const SECRET = process.env.JWT_SECRET || "yoursecretkey";

export async function hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export function signToken(userId: number, role: string) {
    return jwt.sign({ userId, role }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET);
    } catch (e) {
        return null;
    }
}

export async function getUserFromRequest(req: NextApiRequest) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload) return null;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) return null;
    return user;
}
