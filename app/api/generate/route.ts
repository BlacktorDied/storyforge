import OpenAI from "openai";
import { buildStoryPrompt } from "@/lib/prompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("=== INPUT ===");
    console.log(JSON.stringify(body, null, 2));

    const { genre, setting, races, classes, length, partySize, level } = body;

    const prompt = buildStoryPrompt({
      genre,
      setting,
      races,
      classes,
      length,
      partySize,
      level,
    });

    console.log("=== PROMPT ===");
    console.log(prompt);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Dungeon Master creating structured Dungeons & Dragons 5e one-shot adventures. Follow the requested format exactly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
    });

    const result = completion.choices[0].message.content ?? "";

    console.log("=== OUTPUT ===");
    console.log(result);

    return Response.json({ result });
  } catch (error) {
    console.error("Generation error:", error);

    return Response.json({
      result: "Error: " + String(error),
    });
  }
}
