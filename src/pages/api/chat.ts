import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { getOpenAICompletion } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { messages } = req.body; // messages格式: [{role: 'user'|'assistant', content: '...'}, ...]

    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid messages format' });

    // 向OpenAI请求
    try {
        const response = await getOpenAICompletion(messages);
        const assistantMessage = response.choices?.[0]?.message?.content || "";
        const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

        // 将用户和assistant消息保存到数据库
        await prisma.chatMessage.create({
            data: {
                userId: user.id,
                content: messages[messages.length - 1].content,
                role: 'user'
            }
        });
        await prisma.chatMessage.create({
            data: {
                userId: user.id,
                content: assistantMessage,
                role: 'assistant'
            }
        });

        // 更新用户的token使用量
        await prisma.user.update({
            where: { id: user.id },
            data: {
                tokenUsage: user.tokenUsage + usage.total_tokens
            }
        });

        res.json({ message: assistantMessage });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'OpenAI API error' });
    }
}
