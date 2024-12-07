import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../../lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).end();
    const { id, email, role, tokenUsage } = user;
    res.json({ id, email, role, tokenUsage });
}
