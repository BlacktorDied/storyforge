import OpenAI from "openai";
import { buildStoryPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { result: "Error: OPENAI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const client = new OpenAI({ apiKey });

    const body = await req.json();

    if (process.env.NODE_ENV === "development") {
      console.log("=== INPUT ===");
      console.log(JSON.stringify(body, null, 2));
    }

    const { genre, setting, races, classes, sessionLength, partySize, level } =
      body;

    const prompt = buildStoryPrompt({
      genre,
      setting,
      races,
      classes,
      sessionLength,
      partySize,
      level,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("=== PROMPT ===");
      console.log(prompt);
    }

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

    if (process.env.NODE_ENV === "development") {
      console.log("=== OUTPUT ===");
      console.log(result);
    }

    return Response.json({ result });
  } catch (error) {
    console.error("Generation error:", error);

    return Response.json(
      { result: "Error: " + String(error) },
      { status: 500 },
    );
  }
}
