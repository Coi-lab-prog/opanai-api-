import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

export async function getOpenAICompletion(messages: { role: 'user' | 'assistant' | 'system', content: string }[]) {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
    });
    return response.data;
}
