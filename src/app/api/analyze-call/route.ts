import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateGeminiPrompt } from "@/lib/promptTemplates";

interface FeedbackResponse {
  scores: Record<string, number>;
  overallFeedback: string;
  observation: string;
}

const deepgramApiKey = process.env.DEEPGRAM_API_KEY!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

function extractJsonFromMarkdown(text: string): string | null {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No audio file uploaded." },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    //  Transcribe audio  with Deepgram model - Nova 3
    const deepgram = createClient(deepgramApiKey);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: "nova-3",
        smart_format: true,
        mimetype: mimeType,
      }
    );
    if (error) {
      throw error;
    }
    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    if (!transcript) {
      return NextResponse.json(
        { error: "Transcription failed." },
        { status: 500 }
      );
    }

    // Analyze teh transcription with Gemini  (model - 1.5 flash)
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = generateGeminiPrompt(transcript);
    const geminiResult = await model.generateContent(prompt);
    const geminiText =
      typeof geminiResult.response.candidates?.[0]?.content?.parts?.[0]
        ?.text === "string"
        ? geminiResult.response.candidates[0].content.parts[0].text
        : typeof geminiResult.response.text === "string"
        ? geminiResult.response.text
        : "";

    // parse the JSON from Gemini's response
    let feedback: FeedbackResponse;
    try {
      feedback = JSON.parse(geminiText);
    } catch {
      const extracted = extractJsonFromMarkdown(geminiText);
      if (typeof extracted === "string") {
        try {
          feedback = JSON.parse(extracted);
        } catch {
          return NextResponse.json(
            {
              error: "Gemini response was not a valid JSON after extraction.",
              raw: extracted,
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "response from gemini was not a valid JSON.", raw: geminiText },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
