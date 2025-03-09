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
        messages: [
          { role: "system", content: "You are a creative and knowledgeable D&D Dungeon Master. Generate a detailed 5e D&D magic item based on the given prompt. The item should be balanced and formatted according to standard 5e rules." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(magicItemSchema, "magic_item"),
    });

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
