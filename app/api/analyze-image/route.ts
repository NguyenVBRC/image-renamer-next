import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { base64Image } = await request.json();

    if (!base64Image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyze this image and provide a descriptive filename (without extension). Respond in this JSON format: {"filename": "descriptive-filename", "description": "Brief description of the image"}',
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    });

    const aiResponse = response.choices[0].message.content;
    console.log("AI Response: ", aiResponse);

    try {
      // Extract JSON from markdown code blocks
      let jsonString = aiResponse || "{}";

      // Remove markdown code blocks and newlines
      jsonString = jsonString.replace(/```json\s*|\s*```/g, "").trim();

      const parsed = JSON.parse(jsonString);
      console.log("Parsing succeeded:", parsed);

      return NextResponse.json({
        description: parsed.description || "AI-generated description",
        suggestedName: parsed.filename || "ai-generated-filename",
        confidence: 0.9,
      });
    } catch (parseError) {
      console.log("Parsing failed:", parseError);
      console.log("Raw response:", aiResponse);

      // If JSON parsing fails, create a response from the raw text
      return NextResponse.json({
        description: aiResponse || "AI-generated description",
        suggestedName: "ai-generated-filename",
        confidence: 0.8,
      });
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
