import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { comparePassword, signToken } from "../../../lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await comparePassword(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ error: 'Account disabled' });

    const token = signToken(user.id, user.role);

    return res.json({ token });
}
