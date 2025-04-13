import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { magicItemSchema } from "@/schema/MagicItem";

const openai = new OpenAI({
  apiKey: process.env.SECRET_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt cannot be empty.' }, { status: 400 });
    }

    const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        temperature: 2,
        top_p: 0.95,
        messages: [
          { role: "system", content: "You are a highly creative and original D&D Dungeon Master with a deep knowledge of 5e magic items. Generate a unique and imaginative D&D 5e magic item based on the prompt. Avoid common or overused names and effects. Push your creativity while keeping the item balanced and usable in most campaigns. Surprise the user with clever, unexpected, or strange design elements." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(magicItemSchema, "magic_item"),
    });

    console.log('Temp & Top_P v0.4'); 

    return NextResponse.json({
      response: JSON.parse(completion.choices[0]?.message?.content || '{}'),
      total_tokens: completion.usage?.total_tokens || 0,
    });

  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response from OpenAI.' },
      { status: 500 }
    );
  }
}
