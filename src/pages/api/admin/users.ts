import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    if (req.method === 'GET') {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, isActive: true, role: true, tokenUsage: true }
        });
        return res.json(users);
    } else if (req.method === 'POST') {
        const { userId, isActive } = req.body;
        if (userId == null || typeof isActive !== 'boolean') return res.status(400).json({ error: 'Invalid params' });
        await prisma.user.update({
            where: { id: userId },
            data: { isActive }
        });
        return res.json({ success: true });
    } else {
        return res.status(405).end();
    }
}
